/**
 * Scheduled SituationModel
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Injectable } from '@angular/core'

import {
  combineLatest,
  from,
  of,
  zip,
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs'
import { concatMap, filter, first, map, tap } from 'rxjs/operators'
// import evalplan from '../../../mock/fixtures/evalplan'
import { EvalPlanModel } from '../../shared/models/moodle/eval-plan.model'
import { GroupAssignmentModel } from '../../shared/models/moodle/group-assignment.model'
import { RoleModel } from '../../shared/models/moodle/role.model'
import { SituationModel } from '../../shared/models/moodle/situation.model'
import { AppraiserSituationStatsModel } from '../../shared/models/ui/appraiser-situation-stats.model'
import { ScheduledSituation } from '../../shared/models/ui/scheduled-situation.model'
import { StudentSituationStatsModel } from '../../shared/models/ui/student-situation-stats.model'
import { mergeExistingBehaviourSubject } from '../../shared/utils/helpers'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AppraisalUiService } from './appraisal-ui.service'
import { AuthService } from './auth.service'
import { BaseDataService } from './base-data.service'
import { EvalPlanService } from './eval-plan.service'

@Injectable({
  providedIn: 'any',
})
export class ScheduledSituationService {
  private scheduledSituationsEntities$ = new BehaviorSubject<
    ScheduledSituation[]
  >(null)

  private studentSituationStats$ = new BehaviorSubject<
    StudentSituationStatsModel[]
  >(null)

  private appraiserSituationStats$ = new BehaviorSubject<
    AppraiserSituationStatsModel[]
  >(null)

  subscription: Subscription

  constructor(
    private baseDataService: BaseDataService,
    private authService: AuthService,
    private appraisalUIService: AppraisalUiService,
    private evalPlanService: EvalPlanService
  ) {
    this.authService.loggedUser.subscribe((loggedUser) => {
      if (!loggedUser) {
        this.scheduledSituationsEntities$.next(null)
        this.studentSituationStats$.next(null)
        this.appraiserSituationStats$.next(null)

        if (this.subscription) {
          this.subscription.unsubscribe()
        }
      } else {
        this.refresh().subscribe()
        this.subscription = combineLatest([
          this.appraisalUIService.appraisals$,
          this.scheduledSituationsEntities$,
          this.baseDataService.groupAssignment$,
          this.evalPlanService.plans$,
        ])
          .pipe(
            filter(
              ([appraisals, allsituations, groupAssignments, evalplan]) =>
                appraisals != null &&
                allsituations != null &&
                loggedUser != null &&
                evalplan != null
            ),
            tap(([appraisals, allsituations, groupAssignments, evalplan]) => {
              if (
                this.authService.isStillLoggedIn() &&
                this.authService.isStudent
              ) {
                this.buildStudentStatistics(
                  allsituations,
                  appraisals,
                  loggedUser.userid
                )
              }
            }),
            tap(([appraisals, allsituations, groupAssignments, evalplan]) => {
              if (
                this.authService.isStillLoggedIn() &&
                this.authService.isAppraiser &&
                groupAssignments
              ) {
                this.buildAppraiserStatistics(
                  appraisals,
                  allsituations,
                  groupAssignments,
                  evalplan
                )
              }
            })
          )
          .subscribe()
      }
    })
  }

  public get situations$(): Observable<ScheduledSituation[]> {
    return this.scheduledSituationsEntities$.asObservable()
  }

  /**
   * Get stats for scheduled situation (student version)
   *
   *  - appraisal left
   *  - appraisal done
   *
   * @param evalPlanId
   */
  public getMyScheduledSituationStats(
    evalPlanId
  ): Observable<StudentSituationStatsModel> {
    return this.studentSituationStats$.pipe(
      filter((obj) => obj != null),
      concatMap((allstats) => from(allstats)),
      filter((stat) => stat.id == evalPlanId)
    )
  }

  /**
   * Get stats for scheduled situation (appraiser version)
   *
   *  - appraisal left
   *  - appraisal done
   *
   * @param evalPlanId
   * @param studentId
   */
  public getAppraiserScheduledSituationStats(
    evalPlanId,
    studentId
  ): Observable<AppraiserSituationStatsModel> {
    return this.appraiserSituationStats$.pipe(
      filter((obj) => obj != null),
      concatMap((allstats) => from(allstats)),
      filter((stat) => stat.id == evalPlanId && stat.studentId == studentId)
    )
  }

  /**
   * Refresh data for currently logged in user
   */
  public refresh(): Observable<ScheduledSituation[]> {
    if (this.authService.isStillLoggedIn()) {
      return zip(
        this.evalPlanService.plans$.pipe(filter((obj) => obj != null)),
        this.baseDataService.situations$.pipe(filter((obj) => obj != null)),
        this.baseDataService.groupAssignment$.pipe(
          filter((obj) => obj != null)
        ),
        this.baseDataService.roles$.pipe(filter((obj) => obj != null))
      ).pipe(
        first(),
        map(([evalplans, situations, groupAssignments, roles]) => {
          if (this.authService.isStillLoggedIn()) {
            if (this.authService.isStudent) {
              return this.buildScheduledSituationsForStudent(
                evalplans as EvalPlanModel[],
                situations as SituationModel[],
                groupAssignments as GroupAssignmentModel[]
              )
            } else {
              return this.buildScheduledSituationsForAppraiser(
                evalplans as EvalPlanModel[],
                situations as SituationModel[],
                roles as RoleModel[],
                groupAssignments as GroupAssignmentModel[],
                this.authService.loggedUser.getValue().userid
              )
            }
          }
        })
      )
    } else {
      return of([])
    }
  }

  /**
   * Build scheduled session for student
   *
   * @param evalPlans
   * @param situations
   * @param roles
   * @private
   */
  private buildScheduledSituationsForStudent(
    evalPlans: EvalPlanModel[],
    situations: SituationModel[],
    groupAssignments: GroupAssignmentModel[]
  ): ScheduledSituation[] {
    const scheduledSituations = []
    evalPlans.forEach((eplan: EvalPlanModel) => {
      const evalPlanInGroup = groupAssignments.find(
        (ga) => ga.groupid == eplan.groupid
      )
      if (evalPlanInGroup) {
        const scheduledSituation = this.buildScheduledSituation(
          eplan,
          situations
        )
        scheduledSituations.push(scheduledSituation)
      }
    })
    this.scheduledSituationsEntities$.next(scheduledSituations)
    return scheduledSituations
  }

  /**
   * Build scheduled session for appraiser
   *
   * @param evalPlans
   * @param situations
   * @param roles
   * @private
   */
  private buildScheduledSituationsForAppraiser(
    evalPlans: EvalPlanModel[],
    situations: SituationModel[],
    roles: RoleModel[],
    groupAssignment: GroupAssignmentModel[],
    userid
  ): ScheduledSituation[] {
    const scheduledSituations = []
    evalPlans.forEach((eplan: EvalPlanModel) => {
      const scheduledSituation = this.buildScheduledSituation(eplan, situations)

      const hasSituation = roles.find(
        (r) =>
          r.userid == userid &&
          r.clsituationid == scheduledSituation.situation.id
      )

      if (hasSituation) {
        const assignedStudents = groupAssignment.filter(
          (ga) => (ga.groupid = eplan.groupid)
        )
        if (assignedStudents) {
          assignedStudents.forEach((ga) => {
            const studentScheduledSituation = new ScheduledSituation(
              Object.assign({}, scheduledSituation)
            )
            studentScheduledSituation.studentId = ga.studentid
            scheduledSituations.push(studentScheduledSituation)
          })
        }
      }
    })
    this.scheduledSituationsEntities$.next(scheduledSituations)
    return scheduledSituations
  }

  private buildScheduledSituation(
    evalPlan: EvalPlanModel,
    situations: SituationModel[]
  ): ScheduledSituation {
    const currentSituation = situations.find(
      (s) => s.id == evalPlan.clsituationid
    )
    return new ScheduledSituation({
      evalPlanId: evalPlan.id,
      situation: currentSituation,
      evalPlan: evalPlan,
    })
  }

  private buildStudentStatistics(allsituations, appraisals, currentUserId) {
    let allStudentStats = []
    if (allsituations) {
      allsituations.forEach((situation) => {
        if (situation.evalPlan) {
          const appraisalsRequired = situation.situation.expectedevalsnb
          const nbAppraisalStudent = appraisals
            ? appraisals.filter(
                (appraisal) =>
                  appraisal.evalPlan &&
                  appraisal.student.userid == currentUserId &&
                  appraisal.evalPlan.id == situation.evalPlanId
              ).length
            : 0

          const studentStats = new StudentSituationStatsModel({
            id: situation.evalPlanId,
            appraisalsCompleted: nbAppraisalStudent,
            appraisalsRequired: appraisalsRequired,
            status:
              nbAppraisalStudent > appraisalsRequired
                ? 'done'
                : nbAppraisalStudent
                ? 'in_progress'
                : 'todo',
          })
          allStudentStats.push(studentStats)
        }
      })
      mergeExistingBehaviourSubject(
        this.studentSituationStats$,
        allStudentStats,
        ['id']
      )
    }
  }

  private buildAppraiserStatistics(
    appraisals,
    allsituations,
    groupAssignments,
    evalplan
  ) {
    if (allsituations) {
      let appraiserStats = []
      allsituations.forEach((situation) => {
        const appraisalsRequired = situation.situation.expectedevalsnb
        const existingAppraisalAppraiser = appraisals
          ? appraisals.filter(
              (appraisal) => appraisal.evalPlan.id == situation.evalPlanId
            )
          : []
        // Now fetch all students involved
        const nbAppraisalAppraiserStudent = existingAppraisalAppraiser.filter(
          (appraisal) => situation.studentId == appraisal.student.userid
        ).length
        appraiserStats.push(
          new AppraiserSituationStatsModel({
            id: situation.evalPlanId,
            appraisalsCompleted: nbAppraisalAppraiserStudent,
            appraisalsRequired: situation.situation.expectedevalsnb,
            status:
              nbAppraisalAppraiserStudent > appraisalsRequired
                ? 'done'
                : nbAppraisalAppraiserStudent
                ? 'in_progress'
                : 'todo',
            studentId: situation.studentId,
          })
        )
      })
      mergeExistingBehaviourSubject(
        this.appraiserSituationStats$,
        appraiserStats,
        ['id', 'studentId']
      )
    }
  }
}
