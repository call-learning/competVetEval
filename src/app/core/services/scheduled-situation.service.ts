import { CevUser } from './../../shared/models/cev-user.model'
import { Injectable } from '@angular/core'

import { forkJoin } from 'rxjs'
import { combineLatest, of, BehaviorSubject, Observable } from 'rxjs'
import { concatMap, filter, first, map, tap } from 'rxjs/operators'
import { EvalPlanModel } from '../../shared/models/moodle/eval-plan.model'
import { GroupAssignmentModel } from '../../shared/models/moodle/group-assignment.model'
import { RoleModel } from '../../shared/models/moodle/role.model'
import { SituationModel } from '../../shared/models/moodle/situation.model'
import { AppraiserSituationStatsModel } from '../../shared/models/ui/appraiser-situation-stats.model'
import { ScheduledSituation } from '../../shared/models/ui/scheduled-situation.model'
import { StudentSituationStatsModel } from '../../shared/models/ui/student-situation-stats.model'
import { AppraisalUiService } from './appraisal-ui.service'
import { AuthService, LOGIN_STATE } from './auth.service'
import { BaseDataService } from './base-data.service'
import { EvalPlanService } from './eval-plan.service'
/**
 * Scheduled SituationModel
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

@Injectable({
  providedIn: 'any',
})
export class ScheduledSituationService {
  private scheduledSituationsEntities$ = new BehaviorSubject<
    ScheduledSituation[]
  >(null)

  public situationStats$ = new BehaviorSubject<
    StudentSituationStatsModel[] | AppraiserSituationStatsModel[]
  >(null)

  constructor(
    private baseDataService: BaseDataService,
    private authService: AuthService,
    private appraisalUIService: AppraisalUiService,
    private evalPlanService: EvalPlanService
  ) {
    this.authService.loginState$.subscribe((loginState) => {
      if (loginState !== LOGIN_STATE.LOGGED) {
        this.resetService()
      } else {
        this.refreshSituations().subscribe()
      }
    })

    combineLatest([
      this.appraisalUIService.appraisals$,
      this.scheduledSituationsEntities$,
    ])
      .pipe(
        filter(([appraisals, allsituations]) => {
          return appraisals !== null && allsituations !== null
        }),
        concatMap(([appraisals, allsituations]) => {
          return forkJoin([
            of(appraisals),
            of(allsituations),
            this.authService.loginState$.pipe(first()),
            this.baseDataService.groupAssignments$,
          ])
        }),
        tap(([appraisals, allsituations, loginState, groupAssignments]) => {
          if (loginState === LOGIN_STATE.LOGGED) {
            if (this.authService.isStudent) {
              this.buildStudentStatistics(
                allsituations,
                appraisals,
                this.authService.loggedUserValue.userid
              )
            } else if (this.authService.isAppraiser && groupAssignments) {
              this.buildAppraiserStatistics(appraisals, allsituations)
            }
          }
        })
      )
      .subscribe()
  }

  resetService() {
    this.scheduledSituationsEntities$.next(null)
    this.situationStats$.next(null)
  }

  public get situations$(): Observable<ScheduledSituation[]> {
    return this.scheduledSituationsEntities$.asObservable().pipe(
      filter((situations) => !!situations),
      first()
    )
  }

  /**
   * Refresh data for currently logged in user
   */
  public refreshSituations(): Observable<ScheduledSituation[]> {
    return forkJoin([
      this.baseDataService.situations$,
      this.baseDataService.groupAssignments$,
      this.baseDataService.roles$,
      this.evalPlanService.plans$,
    ]).pipe(
      map(([situations, groupAssignments, roles, evalplans]) => {
        if (this.authService.isStillLoggedIn()) {
          if (this.authService.isStudent) {
            return this.buildScheduledSituationsForStudent(
              evalplans,
              situations,
              groupAssignments
            )
          } else {
            return this.buildScheduledSituationsForAppraiser(
              evalplans,
              situations,
              roles,
              groupAssignments,
              this.authService.loggedUserValue.userid
            )
          }
        } else {
          return []
        }
      }),
      tap((scheduledSituations) => {
        this.scheduledSituationsEntities$.next(scheduledSituations)
      })
    )
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
        (ga) => ga.groupid === eplan.groupid
      )
      if (evalPlanInGroup) {
        const scheduledSituation = this.buildScheduledSituation(
          eplan,
          situations
        )
        scheduledSituations.push(scheduledSituation)
      }
    })
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
          r.userid === userid &&
          r.clsituationid === scheduledSituation.situation.id
      )

      if (hasSituation) {
        const assignedStudents = groupAssignment.filter(
          (ga) => ga.groupid === eplan.groupid
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
    return scheduledSituations
  }

  private buildScheduledSituation(
    evalPlan: EvalPlanModel,
    situations: SituationModel[]
  ): ScheduledSituation {
    const currentSituation = situations.find(
      (s) => s.id === evalPlan.clsituationid
    )
    return new ScheduledSituation({
      evalPlanId: evalPlan.id,
      situation: currentSituation,
      evalPlan,
    })
  }

  private buildStudentStatistics(allsituations, appraisals, currentUserId) {
    const allStudentStats = []
    if (allsituations) {
      allsituations.forEach((situation) => {
        if (situation.evalPlan) {
          const appraisalsRequired = situation.situation.expectedevalsnb
          const nbAppraisalStudent = appraisals
            ? appraisals.filter(
                (appraisal) =>
                  appraisal.evalPlan &&
                  appraisal.student.userid === currentUserId &&
                  appraisal.evalPlan.id === situation.evalPlanId &&
                  appraisal.appraiser // Make sure we only count appraisal assigned to an appraiser
              ).length
            : 0

          const studentStats = new StudentSituationStatsModel({
            id: situation.evalPlanId,
            appraisalsCompleted: nbAppraisalStudent,
            appraisalsRequired,
            status:
              nbAppraisalStudent >= appraisalsRequired
                ? 'done'
                : nbAppraisalStudent
                ? 'in_progress'
                : 'todo',
          })
          allStudentStats.push(studentStats)
        }
      })
      this.situationStats$.next(allStudentStats)
    }
  }

  private buildAppraiserStatistics(appraisals, allsituations) {
    if (allsituations) {
      const appraiserStats = []
      allsituations.forEach((situation) => {
        const appraisalsRequired = situation.situation.expectedevalsnb
        const existingAppraisalAppraiser = appraisals
          ? appraisals.filter((appraisal) => {
              return (
                appraisal.evalPlan.id === situation.evalPlanId &&
                appraisal.appraiser
              ) // Make sure we only count appraisal assigned to an appraiser
            })
          : []
        // Now fetch all students involved
        const nbAppraisalAppraiserStudent = existingAppraisalAppraiser.filter(
          (appraisal) => situation.studentId === appraisal.student.userid
        ).length
        appraiserStats.push(
          new AppraiserSituationStatsModel({
            id: situation.evalPlanId,
            appraisalsCompleted: nbAppraisalAppraiserStudent,
            appraisalsRequired: situation.situation.expectedevalsnb,
            status:
              nbAppraisalAppraiserStudent >= appraisalsRequired
                ? 'done'
                : nbAppraisalAppraiserStudent
                ? 'in_progress'
                : 'todo',
            studentId: situation.studentId,
          })
        )
      })
      this.situationStats$.next(appraiserStats)
    }
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
    return this.situationStats$.pipe(
      filter((obj) => obj != null),
      map((allstats) => {
        return allstats.find((stat) => stat.id === evalPlanId)
      })
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
    return this.situationStats$.pipe(
      filter((obj) => obj != null),
      map((allstats) => allstats as AppraiserSituationStatsModel[]),
      map((allstats: AppraiserSituationStatsModel[]) => {
        // Skip while.
        return allstats.find(
          (stat) => stat.id === evalPlanId && stat.studentId === studentId
        )
      })
    )
  }

  public getStudentGroupAssignments(user: CevUser) {
    return this.baseDataService.groupAssignments$.pipe(
      map((groups) => {
        return groups.filter((group) => {
          return group.studentid === user.userid
        })
      })
    )
  }

  public getAppraiserRoles(user: CevUser) {
    return this.baseDataService.roles$.pipe(
      map((roles) => {
        return roles.filter((role) => {
          return role.userid === user.userid
        })
      })
    )
  }
}
