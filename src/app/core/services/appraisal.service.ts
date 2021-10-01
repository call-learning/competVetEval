/**
 * Appraisal basic model retrieval and submission
 *
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Injectable } from '@angular/core'

import { combineLatest, from, of, BehaviorSubject, Observable, iif } from 'rxjs'
import { concatMap, filter, first, map, mapTo, tap } from 'rxjs/operators'
import { AppraisalCriterionModel } from '../../shared/models/moodle/appraisal-criterion.model'
import { AppraisalModel } from '../../shared/models/moodle/appraisal.model'
import { mergeExistingBehaviourSubject } from '../../shared/utils/helpers'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService, LOGIN_STATE } from './auth.service'
import { BaseDataService } from './base-data.service'
import { CriteriaService } from './criteria.service'
import { EvalPlanService } from './eval-plan.service'
// nnkitodo[FILE]
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
  protected appraisalModels$ = new BehaviorSubject<AppraisalModel[]>(null)

  protected appraisalCriterionModels$ = new BehaviorSubject<
    AppraisalCriterionModel[]
  >(null)

  /**
   * Start and retrieve appraisal and criteria for this user
   *
   * @param moodleApiService
   * @param authService
   * @param criteriaService
   * @param userDataService
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
      if (state === LOGIN_STATE.LOGGED) {
        // Get all appraisals and appraisal criteria for this user.
        this.refresh().subscribe()
      } else {
        this.appraisalCriterionModels$.next(null)
        this.appraisalModels$.next(null)
      }
    })
  }

  /**
   * Retrieve appraisals for currently logged in user
   */
  public get appraisals$(): Observable<AppraisalModel[]> {
    return this.appraisalModels$.asObservable()
  }

  /**
   * Retrieve appraisals criteria for currently logged in user
   */
  public get appraisalsCriteria$(): Observable<AppraisalCriterionModel[]> {
    return this.appraisalCriterionModels$.asObservable()
  }

  /**
   * Retrieve appraisal criteria for this appraisal
   * Check first if there is more recent version on the server
   * @param appraisalId
   */
  public appraisalsCriteriaForAppraisalId(
    appraisalId
  ): Observable<AppraisalCriterionModel[]> {
    // First check if it is not already loaded.
    return this.appraisalCriterionModels$.pipe(
      filter((obj) => obj != null),
      map((appraisals) =>
        appraisals.filter((apc) => apc.appraisalid === appraisalId)
      )
    )
  }

  /**
   * Get model for appraiser
   *
   * @protected
   */
  protected getAppraisalModelForAppraiser(): Observable<AppraisalModel[]> {
    return this.baseDataService.isLoaded$.pipe(
      filter((isLoaded) => isLoaded),
      first(),
      concatMap(() => {
        return this.evalPlanService.plans$.pipe(
          filter((obj) => obj != null),
          first()
        )
      }),
      concatMap((evalplans) => {
        // First check all situations involved.
        const mySituations = this.baseDataService.entities.situations.filter(
          (sit) => {
            return (
              this.baseDataService.entities.roles.find(
                (r) => r.clsituationid === sit.id
              ) !== undefined
            )
          }
        )
        // Filter all eval plan depending on the current appraiser.
        return from(
          evalplans.filter((evalplan) => {
            return (
              mySituations.find((s) => s.id === evalplan.clsituationid) !==
              undefined
            )
          })
        )
      }),
      // Now fetch the matching appraisal.
      concatMap((evalPlan) =>
        this.moodleApiService.fetchMoreRecentData(
          'appraisal',
          { evalplanid: evalPlan.id },
          this.appraisalModels$
            .getValue()
            ?.filter((app) => app.evalplanid === evalPlan.id)
        )
      ),
      tap((newAppraisals: AppraisalModel[]) => {
        // Merge existing values with new values
        mergeExistingBehaviourSubject(this.appraisalModels$, newAppraisals, [
          'id',
        ])
      })
    )
  }

  /**
   * Get model for student
   *
   * @param studentid
   * @protected
   */
  protected getAppraisalsModelForStudent(
    studentid
  ): Observable<AppraisalModel[]> {
    return (
      this.moodleApiService.fetchMoreRecentData(
        'appraisal',
        { studentid },
        this.appraisalModels$
          .getValue()
          ?.filter((app) => app.studentid === studentid)
      ) as Observable<AppraisalModel[]>
    ).pipe(
      first(),
      tap((newAppraisals) => {
        // Merge existing values with new values
        mergeExistingBehaviourSubject(this.appraisalModels$, newAppraisals, [
          'id',
        ])
      })
    )
  }

  /**
   * Refresh models and a return an observable to be subscribed to
   *
   * @protected
   */
  public refresh(): Observable<AppraisalCriterionModel[]> {
    return iif(
      () => this.authService.isStudent,
      this.getAppraisalsModelForStudent(
        this.authService.loggedUser$.getValue().userid
      ),
      this.getAppraisalModelForAppraiser()
    ).pipe(
      concatMap((appraisalModels) => from(appraisalModels)),
      concatMap((appraisal: AppraisalModel) => {
        return this.moodleApiService
          .fetchMoreRecentData(
            'appr_crit',
            { appraisalid: appraisal.id },
            this.appraisalCriterionModels$
              .getValue()
              ?.filter((appc) => appc.appraisalid === appraisal.id)
          )
          .pipe(
            map((appraisalCriteriaModels) => {
              return appraisalCriteriaModels.map(
                (model) => new AppraisalCriterionModel(model)
              )
            })
          )
      }),
      map((appraisalsCriteria) => {
        // Make sure we store them so we can retrieve them later.
        mergeExistingBehaviourSubject(
          this.appraisalCriterionModels$,
          appraisalsCriteria,
          ['id']
        )
        return appraisalsCriteria as AppraisalCriterionModel[]
      })
    )
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

    return this.criteriaService.getCriteriaFromEvalGrid(evalGridId).pipe(
      concatMap((criteria) => {
        const appraisalCriteriaModel = criteria.map((criterionmodel) =>
          AppraisalCriterionModel.createFromCriterionModel(criterionmodel)
        )

        // Submit the appraisal, get the ID and then submit the criteria.
        const newAppraisalModel = this.submitAppraisal(appraisalModel)
        // Then create the appraisal criterion
        return newAppraisalModel.pipe(
          concatMap((resAppraisalModel) => {
            appraisalCriteriaModel.forEach(
              (apc) => (apc.appraisalid = resAppraisalModel.id)
            )
            return this.submitAppraisalCriteria(appraisalCriteriaModel).pipe(
              mapTo(appraisalModel),
              tap((newAppraisal) => {
                appraisalModel.id = resAppraisalModel.id
                mergeExistingBehaviourSubject(
                  this.appraisalModels$,
                  [newAppraisal],
                  ['id']
                )
              })
            )
          })
        )
        // See: https://medium.com/@snorredanielsen/rxjs-accessing-a-previous-value-further-down-the-pipe-chain-b881026701c1
      })
    )
  }

  /**
   * Submit appraisal to server and retrieve it in memory
   *
   * @param appraisalModel
   */
  public submitAppraisal(
    appraisalModel: AppraisalModel
  ): Observable<AppraisalModel> {
    return this.moodleApiService.submitAppraisal(appraisalModel).pipe(
      tap((newAppraisalModel) => {
        // Update internal cached data.
        mergeExistingBehaviourSubject(
          this.appraisalModels$,
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
  public submitAppraisalCriteria(
    appraisalCriterionModels: AppraisalCriterionModel[]
  ): Observable<AppraisalCriterionModel[]> {
    if (appraisalCriterionModels?.length) {
      return this.moodleApiService
        .submitAppraisalCriteria(appraisalCriterionModels)
        .pipe(
          tap((newAppraisaCriterionlModel) => {
            // Update internal cached data.
            mergeExistingBehaviourSubject(
              this.appraisalCriterionModels$,
              newAppraisaCriterionlModel,
              ['id']
            )
          })
        )
    } else {
      return of([])
    }
  }
}
