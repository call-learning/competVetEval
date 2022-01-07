// noinspection ES6UnusedImports

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
  forkJoin,
  merge,
  iif,
  of,
  BehaviorSubject,
  Observable,
  zip,
  from,
  combineLatest,
} from 'rxjs'
import { filter, first, map, mergeAll, mergeMap, tap } from 'rxjs/operators'
import { AppraisalCriterionModel } from '../../shared/models/moodle/appraisal-criterion.model'
import { AppraisalModel } from '../../shared/models/moodle/appraisal.model'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'
import { CriterionForAppraisalTreeModel } from '../../shared/models/ui/criterion-for-appraisal-tree.model'
import { CriterionTreeModel } from '../../shared/models/ui/criterion-tree.model'
import { mergeExistingBehaviourSubject } from '../../shared/utils/helpers'
import { AppraisalService } from './appraisal.service'
import { AuthService, LOGIN_STATE } from './auth.service'
import { CriteriaService } from './criteria.service'
import { EvalPlanService } from './eval-plan.service'
import { UserDataService } from './user-data.service'
import appr from '../../../mock/fixtures/appr'
import { $D } from 'rxjs-debug'

@Injectable({
  providedIn: 'root',
})
export class AppraisalUiService {
  protected appraisalEntities$ = new BehaviorSubject<AppraisalUI[]>(null)

  constructor(
    private authService: AuthService,
    private criteriaService: CriteriaService,
    private userDataService: UserDataService,
    private evalPlanService: EvalPlanService,
    private appraisalService: AppraisalService
  ) {
    this.appraisalService.appraisalsChanged
      .pipe(
        tap((appraisalsChanged) => {
          let appraisalModels = appraisalsChanged.appraisals
          let appraisalCriteria = appraisalsChanged.appraisalCriterionModels

          if (this.authService.loginState$.getValue() !== LOGIN_STATE.LOGGED) {
            this.appraisalEntities$.next([])
          }
          if (appraisalModels === null) {
            appraisalModels = []
            this.appraisalEntities$.next([])
          }
          if (appraisalCriteria === null) {
            appraisalCriteria = []
          }
          if (appraisalModels.length > 0) {
            this.lazyConvertAppraisalModelToUI(
              appraisalModels,
              appraisalCriteria
            )
          } else {
            this.appraisalEntities$.next([])
          }
        })
      )
      .subscribe()
  }

  /**
   * Retrieve appraisals for currently logged in user
   */
  public get appraisals$(): BehaviorSubject<AppraisalUI[]> {
    return this.appraisalEntities$
  }

  private lazyConvertAppraisalModelToUI(
    appraisalModels: AppraisalModel[],
    appraisalCriteriaModels: AppraisalCriterionModel[]
  ) {
    if (appraisalModels) {
      from(appraisalModels)
        .pipe(
          mergeMap((appraisalModel: AppraisalModel) =>
            this.convertAppraisalCriterionModelsToTree(
              appraisalCriteriaModels.filter(
                (apc) => apc.appraisalid === appraisalModel.id
              )
            ).pipe(
              map((ctm: CriterionForAppraisalTreeModel[]) => {
                return {
                  model: appraisalModel,
                  crtreeModel: ctm,
                }
              })
            )
          ),
          map((info) =>
            this.convertAppraisalModel(info.model, info.crtreeModel)
          ),
          mergeAll(),
          tap((appraisalsUI: AppraisalUI) => {
            mergeExistingBehaviourSubject(
              this.appraisalEntities$,
              [appraisalsUI],
              ['id']
            )
          })
        )
        .subscribe()
    }
  }

  /**
   * Convert set of appraisals (criterion) into something that can be displayed in the UI
   *
   * @param apprcriteria
   * @protected
   */
  private convertAppraisalCriterionModelsToTree(
    apprcriteria: AppraisalCriterionModel[]
  ): Observable<CriterionForAppraisalTreeModel[]> {
    const recurseThroughCriteriaTree = (criterionmodel: CriterionTreeModel) => {
      const currentAppraisalCriteria = apprcriteria.find(
        (c) => c.criterionid === criterionmodel.criterion.id
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

    return this.criteriaService.criteriaTree$.pipe(
      map((criteriaTree) => {
        return criteriaTree
          .map((criteriontree) => recurseThroughCriteriaTree(criteriontree))
          .filter((c) => c != null) // Remove null value.
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
    return combineLatest([
      this.userDataService.getUserProfileInfo(app.studentid),
      // If the appraiserid is null, then this is because it has not yet been assigned.
      this.userDataService.getUserProfileInfo(app.appraiserid),
      this.evalPlanService.planFromId(app.evalplanid),
    ]).pipe(
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

  /**
   * Refresh appraisals and feed up the list
   */
  public refreshAppraisals(): Observable<any> {
    return this.appraisalService.refresh()
  }

  /**
   * Retrieve an appraisal from its id.
   * Wait for it until is is retrieved
   */
  public waitForAppraisalId(
    appraisalId: number,
    forceRefresh?: boolean
  ): Observable<AppraisalUI> {
    return iif(() => forceRefresh, this.refreshAppraisals(), of(null)).pipe(
      mergeMap(() => {
        // TODO : use SkipUntil ?
        return this.appraisalEntities$.pipe(
          filter((obj) => obj != null),
          map((appraisals) =>
            appraisals.find((appraisal) => appraisal.id === appraisalId)
          ),
          first()
        )
      })
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
    return this.appraisalEntities$.pipe(
      filter((obj) => obj != null),
      map((appraisals) =>
        appraisals
          .filter(
            (appraisal: AppraisalUI) =>
              appraisal.evalPlan.id === evalPlanId &&
              (studentId == null || appraisal.student.userid === studentId)
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
    const appraisalModel = AppraisalModel.createBlank(
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
        const appraisalCriteriaModel =
          AppraisalCriterionModel.createFromCriterionModel(acriteria.criterion)
        appraisalCriteriaModel.id = acriteria.id
        appraisalCriteriaModel.grade = acriteria.grade
        appraisalCriteriaModel.comment = acriteria.comment
        transformedCriteria.push(appraisalCriteriaModel)
        if (acriteria.subcriteria) {
          transformedCriteria = transformedCriteria.concat(
            flatternAppraisalCriteria(acriteria.subcriteria)
          )
        }
      })
      return transformedCriteria
    }

    const allcriteria = flatternAppraisalCriteria(appraisal.criteria)

    // Submit the appraisal, get the ID and then submit the criteria.
    return this.appraisalService
      .submitAppraisalAndCriteria(appraisalModel, allcriteria)
      .pipe(map((resAppraisalModel) => resAppraisalModel.id))
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
    appraiserId: number,
    comment?: string,
    context?: string
  ): Observable<number> {
    return this.appraisalService
      .createBlankAppraisal(
        evalPlanId,
        evalGridId,
        studentId,
        appraiserId,
        comment,
        context
      )
      .pipe(
        map((newModel) => {
          return newModel.id
        })
      )
  }
}
