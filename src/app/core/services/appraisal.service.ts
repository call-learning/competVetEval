import { Injectable } from '@angular/core'

import { forkJoin, Subject } from 'rxjs'
import { of, Observable } from 'rxjs'
import { concatMap, first, map, mergeMap, tap } from 'rxjs/operators'
import { AppraisalCriterionModel } from '../../shared/models/moodle/appraisal-criterion.model'
import { AppraisalModel } from '../../shared/models/moodle/appraisal.model'
import { mergeWithExisting } from '../../shared/utils/helpers'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService, LOGIN_STATE } from './auth.service'
import { BaseDataService } from './base-data.service'
import { CriteriaService } from './criteria.service'
import { EvalPlanService } from './eval-plan.service'

/**
 * Appraisal basic model retrieval and submission
 *
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

@Injectable({
  providedIn: 'root',
})

/**
 * This class is the base layer for appraisal. The appraisal-ui service relies on
 * this to retrieve and manage the base appraisal model. Appraisal UI services
 * is supposed only to listen to the values of appraisal or / and appraisalcriteria
 *
 */
export class AppraisalService {
  protected appraisalModels: AppraisalModel[] = null
  protected appraisalCriterionModels: AppraisalCriterionModel[] = null
  // If if this not null, then we are currently loading, so we need
  // to wait for the process to finish.
  private appraisalModelLoadingEvent: Subject<AppraisalModel[]> = null

  // If if this not null, then we are currently loading, so we need
  // to wait for the process to finish.
  private appraisalCriterionModelLoadingEvent: Subject<
    AppraisalCriterionModel[]
  > = null

  public appraisalLoadedEvent: Subject<{
    appraisals: AppraisalModel[]
    appraisalCriterionModels: AppraisalCriterionModel[]
  }> = new Subject<{
    appraisals: AppraisalModel[]
    appraisalCriterionModels: AppraisalCriterionModel[]
  }>()

  /**
   * Start and retrieve appraisal and criteria for this user
   *
   * @param moodleApiService
   * @param authService
   * @param criteriaService
   * @param baseDataService
   * @param evalPlanService
   */
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService,
    private criteriaService: CriteriaService,
    private baseDataService: BaseDataService,
    private evalPlanService: EvalPlanService
  ) {
    this.authService.loginState$.subscribe((state) => {
      if (state !== LOGIN_STATE.LOGGED) {
        this.resetService()
      }
    })
  }

  /**
   * Retrieve appraisals for currently logged-in user
   */
  public get appraisals$(): Observable<AppraisalModel[]> {
    if (this.appraisalModels === null) {
      return this.refreshAppraisals()
    } else {
      return of(this.appraisalModels)
    }
  }

  /**
   * Retrieve appraisals for currently logged-in user
   */
  public get appraisalCriteria$(): Observable<AppraisalCriterionModel[]> {
    if (this.appraisalCriterionModels === null) {
      return this.refreshAppraisalCriterionModels()
    } else {
      return of(this.appraisalCriterionModels)
    }
  }

  /**
   * Refresh appraisals and feed up the list
   */
  public forceRefresh() {
    this.resetService()
    this.baseDataService.forceRefresh()
    this.criteriaService.forceRefresh()
    this.evalPlanService.forceRefresh()
    this.refreshAppraisalCriterionModels().pipe(first()).subscribe()
  }

  /**
   * Create a new appraisal and return the newly created appraisal
   *
   * Note that this means that there is now an id in appraisal and appraisal criteria
   * @param appraisalModel
   * @param appraisalCriteriaModel
   */
  public createBlankAppraisal(
    evalPlanId: number,
    evalGridId: number,
    studentId: number,
    appraiserId: number,
    comment?: string,
    context?: string
  ): Observable<AppraisalModel> {
    const appraisalModel = AppraisalModel.createBlank(
      studentId,
      appraiserId,
      evalPlanId,
      comment,
      context
    )
    return this.criteriaService.getCriteria(evalGridId).pipe(
      concatMap((criteria) => {
        const appraisalCriteriaModel = criteria.map((criterionmodel) =>
          AppraisalCriterionModel.createFromCriterionModel(criterionmodel)
        )
        return this.submitAppraisalAndCriteria(
          appraisalModel,
          appraisalCriteriaModel
        )
      })
    )
  }

  /**
   * Appraiser submits a new appraisal or edits an existing one
   *
   * @param appraisalModel
   * @param appraisalCriteriaModel
   */
  public submitAppraisalAndCriteria(
    appraisalModel: AppraisalModel,
    appraisalCriteriaModel: AppraisalCriterionModel[]
  ) {
    // Submit the appraisal, get the ID and then submit the criteria.
    return this.submitAppraisal(appraisalModel).pipe(
      // Then create the appraisal criterion
      concatMap((resAppraisalModel) => {
        appraisalCriteriaModel.forEach(
          (apc) => (apc.appraisalid = resAppraisalModel.id)
        )
        return forkJoin([
          of(resAppraisalModel),
          this.submitAppraisalCriteria(appraisalCriteriaModel),
        ])
      }),
      map(([resAppraisalModel, resAppraisalCriteria]) => resAppraisalModel),
      tap(() => {
        this.emitAppraisalsLoaded()
      })
    )
  }

  /**
   * Send event to subscribers
   *
   * @private
   */
  private emitAppraisalsLoaded() {
    this.appraisalLoadedEvent.next({
      appraisals: this.appraisalModels,
      appraisalCriterionModels: this.appraisalCriterionModels,
    })
  }

  /**
   * Get model for appraiser
   *
   * @protected
   */
  protected getAppraisalForAppraiser(): Observable<Object[]> {
    return forkJoin([
      this.baseDataService.situations$,
      this.baseDataService.roles$,
      this.evalPlanService.plans$,
    ]).pipe(
      map(([situations, roles, evalplans]) => {
        // First check all situations involved.
        const mySituations = situations.filter((sit) => {
          return roles.find((r) => r.clsituationid === sit.id) !== undefined
        })
        // Filter all eval plan depending on the current appraiser.
        return evalplans.filter((evalplan) => {
          return (
            mySituations.find((s) => s.id === evalplan.clsituationid) !==
            undefined
          )
        })
      }),
      // Now fetch the matching appraisal.
      concatMap((evalPlans) => {
        const evalplanIds = evalPlans.map((e) => e.id)
        return this.moodleApiService.fetchMoreRecentData(
          'appraisal',
          { evalplanid: { operator: 'in', values: evalplanIds } },
          this.appraisalModels?.filter((app) =>
            evalplanIds.findIndex((currentId) => currentId == app.id)
          )
        )
      })
    )
  }

  /**
   * Get model for student
   *
   * @param studentid
   * @protected
   */
  private getAppraisalForStudent(studentid): Observable<Object[]> {
    return this.moodleApiService.fetchMoreRecentData(
      'appraisal',
      { studentid },
      this.appraisalModels?.filter((app) => app.studentid === studentid)
    ) as Observable<AppraisalModel[]>
  }

  /**
   * Submit appraisal to server and retrieve it in memory
   *
   * @param appraisalModel
   */
  private submitAppraisal(
    appraisalModel: AppraisalModel
  ): Observable<AppraisalModel> {
    return this.moodleApiService.submitAppraisal(appraisalModel).pipe(
      tap((newAppraisalModel) => {
        // Update internal cached data.
        this.appraisalModels = mergeWithExisting(
          this.appraisalModels,
          [newAppraisalModel],
          ['id']
        )
      })
    )
  }

  /**
   * Submit a set of appraisal criteria to server and retrieve it in memory
   *
   * @param appraisalModel
   */
  private submitAppraisalCriteria(
    appraisalCriterionModels: AppraisalCriterionModel[]
  ): Observable<AppraisalCriterionModel[]> {
    if (appraisalCriterionModels?.length) {
      return this.moodleApiService
        .submitAppraisalCriteria(appraisalCriterionModels)
        .pipe(
          tap((newAppraisaCriterionlModel) => {
            // Update internal cached data.
            this.appraisalCriterionModels = mergeWithExisting(
              this.appraisalCriterionModels,
              newAppraisaCriterionlModel,
              ['id']
            )
          })
        )
    } else {
      return of([])
    }
  }

  /**
   * Refresh models and a return an observable to be subscribed to
   *
   * @protected
   */
  private refreshAppraisals(): Observable<AppraisalModel[]> {
    let refreshObs: Observable<Object[]> = null
    let loadingEvent = this.appraisalModelLoadingEvent
    if (loadingEvent && !loadingEvent.isStopped) {
      return loadingEvent.asObservable()
    }

    loadingEvent = new Subject<AppraisalModel[]>()
    this.appraisalModelLoadingEvent = loadingEvent
    if (this.authService.isStudent) {
      const studentid = this.authService.loggedUser$.getValue().userid
      refreshObs = this.getAppraisalForStudent(studentid)
    } else {
      refreshObs = this.getAppraisalForAppraiser()
    }
    return refreshObs.pipe(
      map((newAppraisalsObject) => {
        {
          // Merge existing values with new values
          const newAppraisals = newAppraisalsObject.map(
            (a) => new AppraisalModel(a)
          )
          this.appraisalModels = mergeWithExisting(
            this.appraisalModels,
            newAppraisals,
            ['id']
          )
          loadingEvent.next(newAppraisals)
          loadingEvent.complete()
          return newAppraisals
        }
      })
    )
  }

  /**
   * Refresh models and a return an observable to be subscribed to
   *
   * @protected
   */
  private refreshAppraisalCriterionModels(): Observable<
    AppraisalCriterionModel[]
  > {
    let loadingEvent = this.appraisalCriterionModelLoadingEvent
    if (loadingEvent && !loadingEvent.isStopped) {
      return loadingEvent.asObservable()
    }
    loadingEvent = new Subject<AppraisalCriterionModel[]>()
    this.appraisalCriterionModelLoadingEvent = loadingEvent
    return this.appraisals$.pipe(
      mergeMap((appraisals) => {
        if (appraisals.length == 0) {
          return of([])
        }
        const appraisalIds = appraisals.map((appraisal) => appraisal.id)
        return this.moodleApiService.fetchMoreRecentData(
          'appr_crit',
          { appraisalid: { operator: 'in', values: appraisalIds } },
          this.appraisalCriterionModels?.filter((appc) =>
            appraisalIds.includes(appc.appraisalid)
          )
        )
      }),
      map((appraisalsCriteria) => {
        // Merge existing values with new values
        const newAppraisalsCriteria = appraisalsCriteria.map(
          (a) => new AppraisalCriterionModel(a)
        )
        this.appraisalCriterionModels = mergeWithExisting(
          this.appraisalCriterionModels,
          newAppraisalsCriteria,
          ['id']
        )
        loadingEvent.next(newAppraisalsCriteria)
        loadingEvent.complete()
        this.emitAppraisalsLoaded()
        return newAppraisalsCriteria
      })
    )
  }

  /**
   * Reinit service
   * @private
   */
  private resetService() {
    this.appraisalCriterionModels = null
    this.appraisalModels = null
    this.appraisalModelLoadingEvent = null
  }
}
