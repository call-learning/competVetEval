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

import { combineLatest, from, of, BehaviorSubject, Observable } from 'rxjs'
import { concatMap, filter, map, mapTo, tap } from 'rxjs/operators'
import { AppraisalCriterionModel } from '../../shared/models/moodle/appraisal-criterion.model'
import { AppraisalModel } from '../../shared/models/moodle/appraisal.model'
import { mergeExistingBehaviourSubject } from '../../shared/utils/helpers'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService } from './auth.service'
import { BaseDataService } from './base-data.service'
import { CriteriaService } from './criteria.service'
import { EvalPlanService } from './eval-plan.service'
import { UserDataService } from './user-data.service'

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
    private userDataService: UserDataService,
    private baseDataService: BaseDataService,
    private evalPlanService: EvalPlanService
  ) {
    this.authService.loggedUser.subscribe((cevUser) => {
      if (cevUser) {
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
  public get appraisals$(): BehaviorSubject<AppraisalModel[]> {
    return this.appraisalModels$
  }

  /**
   * Retrieve appraisals criteria for currently logged in user
   */
  public get appraisalsCriteria$(): BehaviorSubject<AppraisalCriterionModel[]> {
    return this.appraisalCriterionModels$
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
        appraisals.filter((apc) => apc.appraisalid == appraisalId)
      )
    )
  }

  /**
   * Get model for appraiser
   *
   * @protected
   */
  protected getAppraisalModelForAppraiser(): Observable<AppraisalModel[]> {
    return combineLatest([
      this.evalPlanService.plans$.pipe(filter((obj) => obj != null)),
      this.baseDataService.situations$.pipe(filter((obj) => obj != null)),
      this.baseDataService.roles$.pipe(filter((obj) => obj != null)),
    ]).pipe(
      concatMap(([evalplans, situations, roles]) => {
        // First check all situations involved.
        const mySituations = situations.filter((sit) => {
          return roles.find((r) => r.clsituationid == sit.id) !== undefined
        })
        // Filter all eval plan depending on the current appraiser.
        return from(
          evalplans.filter((evalplan) => {
            return (
              mySituations.find((s) => s.id == evalplan.clsituationid) !==
              undefined
            )
          })
        )
      }),
      // Now fetch the matching appraisal.
      concatMap((evalPlan) =>
        this.moodleApiService.fetchIfMoreRecent(
          'appraisal',
          { evalplanid: evalPlan.id },
          this.appraisalModels$
            .getValue()
            ?.filter((app) => app.evalplanid == evalPlan.id)
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
      this.moodleApiService.fetchIfMoreRecent(
        'appraisal',
        { studentid },
        this.appraisalModels$
          .getValue()
          ?.filter((app) => app.studentid == studentid)
      ) as Observable<AppraisalModel[]>
    ).pipe(
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
    // At login we refresh always.
    return this.authService.currentUserRole.pipe(
      filter((roletype) => roletype != null),
      concatMap((userType) => {
        if (this.authService.isStudent) {
          const userid = this.authService.loggedUser.getValue().userid
          // Retrieve all appraisal marked with my id as studentid.
          return this.getAppraisalsModelForStudent(userid)
        } else {
          // Retrieve all appraisals I am involved in.
          return this.getAppraisalModelForAppraiser()
        }
      }),
      concatMap((appraisalModels) => from(appraisalModels)),
      concatMap((appraisal: AppraisalModel) => {
        return this.moodleApiService
          .fetchIfMoreRecent(
            'appr_crit',
            { appraisalid: appraisal.id },
            this.appraisalCriterionModels$
              .getValue()
              ?.filter((appc) => appc.appraisalid == appraisal.id)
          )
          .pipe(
            map((appraisalCriteriaModels) =>
              appraisalCriteriaModels.map(
                (model) => new AppraisalCriterionModel(model)
              )
            )
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
    appraiserId: number
  ): Observable<AppraisalModel> {
    const appraisalModel = AppraisalModel.createBlank(
      studentId,
      appraiserId,
      evalPlanId
    )
    const appraisalCriteriaModel = this.criteriaService
      .getCriteriaFromEvalGrid(evalGridId)
      .map((criterionmodel) =>
        AppraisalCriterionModel.createFromCriterionModel(criterionmodel)
      )

    // Submit the appraisal, get the ID and then submit the criteria.
    const newAppraisalModel = this.submitAppraisal(appraisalModel)
    // Then create the appraisal criterion
    return newAppraisalModel.pipe(
      concatMap((appraisalModel) => {
        appraisalCriteriaModel.forEach(
          (apc) => (apc.appraisalid = appraisalModel.id)
        )
        return this.submitAppraisalCriteria(appraisalCriteriaModel).pipe(
          mapTo(appraisalModel),
          tap((newAppraisal) => {
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
  }

  /**
   * Submit appraisal to server and retrieve it in memory
   *
   * @param appraisalModel
   */
  public submitAppraisal(
    appraisalModel: AppraisalModel
  ): Observable<AppraisalModel> {
    return this.moodleApiService.submitAppraisal(appraisalModel)
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
