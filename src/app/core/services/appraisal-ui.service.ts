/**
 * Appraisal higher level model
 *
 * This is directly used in the UI and for interactions
 *
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Injectable } from '@angular/core'

import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  from,
  iif,
  Observable,
  of,
  zip,
} from 'rxjs'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService } from './auth.service'
import {
  concatMap,
  concatMapTo,
  filter,
  map,
  tap,
  toArray,
} from 'rxjs/operators'
import { AppraisalModel } from '../../shared/models/moodle/appraisal.model'
import { BaseDataService } from './base-data.service'
import { EvalPlanService } from './eval-plan.service'
import { CriterionForAppraisalTreeModel } from '../../shared/models/ui/criterion-for-appraisal-tree.model'
import { CriteriaService } from './criteria.service'
import { CriterionTreeModel } from '../../shared/models/ui/criterion-tree.model'
import { AppraisalCriterionModel } from '../../shared/models/moodle/appraisal-criterion.model'
import { UserDataService } from './user-data.service'
import { AppraisalService } from './appraisal.service'
import { mergeExistingBehaviourSubject } from '../../shared/utils/helpers'

@Injectable({
  providedIn: 'root',
})
export class AppraisalUiService {
  protected appraisalEntities = new BehaviorSubject<AppraisalUI[]>(null)

  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService,
    private criteriaService: CriteriaService,
    private userDataService: UserDataService,
    private baseDataService: BaseDataService,
    private evalPlanService: EvalPlanService,
    private appraisalServices: AppraisalService
  ) {
    this.authService.loggedUser.subscribe((cveUser) => {
      // Make sure that all data from this layer is fetch from the basic appraisalService layer
      combineLatest(
        this.appraisalServices.appraisals,
        this.appraisalServices.appraisalsCriteria
      )
        .pipe(
          tap(([appraisalModels, appraisalCriteria]) => {
            if (appraisalModels && appraisalCriteria) {
              this.lazyConvertAppraisalModelToUI(
                appraisalModels,
                appraisalCriteria
              ).subscribe()
            }
          })
        )
        .subscribe()
      if (!cveUser) {
        this.appraisalEntities.next(null)
      }
    })
  }

  /**
   * Retrieve appraisals for currently logged in user
   */
  public get appraisals(): BehaviorSubject<AppraisalUI[]> {
    return this.appraisalEntities
  }

  /**
   * Retrieve an appraisal from its id.
   * Wait for it until is is retrieved
   */
  public waitForAppraisalId(appraisalId: number): Observable<AppraisalUI> {
    return this.appraisalEntities.pipe(
      filter((obj) => obj != null),
      map((appraisals) =>
        appraisals.find((appraisal) => appraisal.id == appraisalId)
      )
    )
  }

  /**
   * Retrieve appraisals for given evaluation plan and given student id
   * @param evalPlanId
   * @param studentId
   */
  public fetchAppraisalsForEvalPlanStudentId(
    evalPlanId,
    studentId
  ): Observable<AppraisalUI[]> {
    return this.appraisalEntities.pipe(
      filter((obj) => obj != null),
      map((appraisals) =>
        appraisals
          .filter(
            (appraisal: AppraisalUI) =>
              appraisal.evalPlan.id == evalPlanId &&
              (studentId == null || appraisal.student.userid == studentId)
          )
          .sort((app1, app2) => app2.timeModified - app1.timeModified)
      )
    )
  }

  /**
   * Submit appraisal and return new appraisal id
   *
   * @param appraisal
   *
   */
  public submitAppraisal(appraisal: AppraisalUI): Observable<number> {
    let appraisalModel = AppraisalModel.createBlank(
      appraisal.student.userid,
      appraisal.appraiser.userid,
      appraisal.evalPlan.id
    )
    appraisalModel.id = appraisal.id
    appraisalModel.comment = appraisal.comment
    appraisalModel.context = appraisal.context

    const flatternAppraisalCriteria = (
      appraisalCriteria: CriterionForAppraisalTreeModel[]
    ) => {
      let transformedCriteria: AppraisalCriterionModel[] = []
      appraisalCriteria.forEach((acriteria) => {
        let appraisalCriteriaModel =
          AppraisalCriterionModel.createFromCriterionModel(acriteria.criterion)
        appraisalCriteriaModel.id = acriteria.id
        appraisalCriteriaModel.grade = acriteria.grade
        appraisalCriteriaModel.comment = acriteria.comment
        transformedCriteria.push(appraisalCriteriaModel)
        if (acriteria.subcriteria) {
          transformedCriteria.concat(
            flatternAppraisalCriteria(acriteria.subcriteria)
          )
        }
      })
      return transformedCriteria
    }

    // Submit the appraisal, get the ID and then submit the criteria.
    return this.appraisalServices.submitAppraisal(appraisalModel).pipe(
      tap((appraisalModel) => {
        // Make sure we setup the appraisal id.
        const allcriteria = flatternAppraisalCriteria(appraisal.criteria)
        allcriteria.forEach(
          (appraisalCriteria) =>
            (appraisalCriteria.appraisalid = appraisalModel.id)
        )

        this.appraisalServices.submitAppraisalCriteria(allcriteria).subscribe()
        return appraisalModel
      }),
      map((appraisalModel) => appraisalModel.id)
    )
  }

  /**
   * Create a blank appraisal
   *
   * @param evalPlanId
   * @param evalGridId
   * @param studentId
   * @param appraiserId
   */
  public createBlankAppraisal(
    evalPlanId: number,
    evalGridId: number,
    studentId: number,
    appraiserId: number
  ): Observable<number> {
    return this.appraisalServices
      .createBlankAppraisal(evalPlanId, evalGridId, studentId, appraiserId)
      .pipe(map((newModel) => newModel.id))
  }

  private lazyConvertAppraisalModelToUI(
    appraisalModels: AppraisalModel[],
    appraisalCriteriaModels: AppraisalCriterionModel[]
  ): Observable<AppraisalUI[]> {
    let currentAppraisalEntities = this.appraisalEntities.getValue()
    let changed = false

    return from(appraisalModels).pipe(
      // Retrieve relevant appraisal models.
      concatMap((appraisalModel: AppraisalModel) => {
        let appraisalExistSameTime = false
        // First check that the appraisal does not exist currently.
        if (this.appraisalEntities.getValue()) {
          appraisalExistSameTime =
            this.appraisalEntities
              .getValue()
              .findIndex(
                (appr) => appr.timeModified == appraisalModel.timemodified
              ) !== -1
        }
        if (appraisalExistSameTime) {
          return of(null)
        } else {
          // Then we convert.
          const appraisalCriteriaUI =
            this.convertAppraisalCriterionModelsToTree(
              appraisalCriteriaModels.filter(
                (apc) => apc.appraisalid == appraisalModel.id
              )
            )
          return this.convertAppraisalModel(appraisalModel, appraisalCriteriaUI)
        }
      }),
      // Filter out unwanted appraisals.
      filter((appraisalui) => appraisalui !== null),
      // Back to array.
      toArray(),
      tap((appraisalsUI) =>
        mergeExistingBehaviourSubject(this.appraisalEntities, appraisalsUI, [
          'id',
        ])
      )
    )
  }

  /**
   * Convert set of appraisals (criterion) into something that can be displayed in the UI
   *
   * @param apprcriteria
   * @protected
   */
  private convertAppraisalCriterionModelsToTree(
    apprcriteria: AppraisalCriterionModel[]
  ): CriterionForAppraisalTreeModel[] {
    const recurseThroughCriteriaTree = (criterionmodel: CriterionTreeModel) => {
      const currentAppraisalCriteria = apprcriteria.find(
        (c) => c.criterionid == criterionmodel.criterion.id
      )
      if (currentAppraisalCriteria) {
        return CriterionForAppraisalTreeModel.fromAppraisalCriterionModel(
          currentAppraisalCriteria,
          criterionmodel.criterion,
          criterionmodel.subcriteria
            .map((subcrit) => recurseThroughCriteriaTree(subcrit))
            .filter((c) => c != null)
        )
      } else {
        return null
      }
    }
    const criteriaForAppraisalTree = this.criteriaService.criteriaTree
      .getValue()
      .map((criteriontree) => recurseThroughCriteriaTree(criteriontree))
      .filter((c) => c != null) // Remove null value.
    return criteriaForAppraisalTree
  }

  /**
   * Get related criteria for appraisal
   *
   * @param appraisalId
   */
  private getRelatedCriteriaAppraisals(
    appraisalId
  ): Observable<CriterionForAppraisalTreeModel[]> {
    return this.appraisalServices
      .appraisalsCriteriaForAppraisalId(appraisalId)
      .pipe(
        map((apprcriteria: AppraisalCriterionModel[]) => {
          return this.convertAppraisalCriterionModelsToTree(apprcriteria)
        })
      )
  }

  /**
   * Convert to appraisal model and get subcriteria information
   *
   *
   * @param app
   * @protected
   */
  private convertAppraisalModel(
    app: AppraisalModel,
    criterionAppraisalUI: CriterionForAppraisalTreeModel[]
  ): Observable<AppraisalUI> {
    // Convert the model into a set of appraisal ready to display in the UI.
    // This means also we recurse through this appraisal to see the grades/comment for each appraisal.
    return zip(
      this.userDataService.getUserProfileInfo(app.studentid),
      this.userDataService.getUserProfileInfo(app.appraiserid),
      this.evalPlanService.planFromId(app.evalplanid)
    ).pipe(
      map(([studentInfo, appraiserInfo, evalplanInfo]) => {
        return new AppraisalUI({
          id: app.id,
          student: studentInfo,
          appraiser: appraiserInfo,
          evalPlan: evalplanInfo,
          context: app.context,
          comment: app.comment,
          criteria: criterionAppraisalUI,
          timeModified: app.timemodified,
        })
      })
    )
  }
}
