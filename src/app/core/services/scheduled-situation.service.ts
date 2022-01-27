import { CevUser } from './../../shared/models/cev-user.model'
import { Injectable } from '@angular/core'

import { asyncScheduler, AsyncSubject, forkJoin, from, Subject } from 'rxjs'
import { combineLatest, of, BehaviorSubject, Observable } from 'rxjs'
import {
  concatMap,
  delay,
  filter,
  first,
  map,
  mergeMap,
  observeOn,
  tap,
  toArray,
} from 'rxjs/operators'
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
  private scheduledSituationsEntities: ScheduledSituation[] = null
  // If if this not null, then we are currently loading, so we need
  // to wait for the process to finish.
  private loadingSituationEvent: Subject<ScheduledSituation[]> = null

  protected statsComputed: Subject<void> = null

  constructor(
    private baseDataService: BaseDataService,
    private authService: AuthService,
    private appraisalUIService: AppraisalUiService,
    private evalPlanService: EvalPlanService
  ) {
    this.authService.loginState$.subscribe((loginState) => {
      if (loginState !== LOGIN_STATE.LOGGED) {
        this.resetService()
      }
    })
  }

  public get situations$(): Observable<ScheduledSituation[]> {
    if (this.scheduledSituationsEntities === null) {
      return this.refreshSituations()
    } else {
      return of(this.scheduledSituationsEntities)
    }
  }

  public get statsComputedEvent$(): Observable<void> {
    if (this.statsComputed) {
      this.statsComputed.asObservable()
    }
    return this.refreshAllSituationStats()
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

  public forceRefresh() {
    this.resetService()
    this.refreshSituations().pipe(first()).subscribe()
  }

  protected refreshAllSituationStats() {
    let currentStatComputed = this.statsComputed
    if (!this.statsComputed) {
      this.statsComputed = new Subject<void>()
      currentStatComputed = this.statsComputed
    }
    return from(this.scheduledSituationsEntities).pipe(
      mergeMap((situation) =>
        forkJoin([
          this.appraisalUIService.appraisals$,
          of(situation),
          this.authService.loginState$.pipe(first()),
          this.baseDataService.groupAssignments$,
        ])
      ),
      mergeMap(([appraisals, situation, loginState, groupAssignments]) => {
        if (loginState === LOGIN_STATE.LOGGED) {
          if (this.authService.isStudent) {
            situation.stats = this.buildStudentStatistics(
              situation,
              appraisals,
              this.authService.loggedUserValue.userid
            )
          } else if (this.authService.isAppraiser && groupAssignments) {
            situation.stats = this.buildAppraiserStatistics(
              situation,
              appraisals
            )
          }
        }
        return of(situation.evalPlanId)
      }),
      toArray(),
      map(() => {
        currentStatComputed.next()
        currentStatComputed.complete()
      })
    )
  }

  /**
   * Refresh data for currently logged in user
   */
  private refreshSituations(): Observable<ScheduledSituation[]> {
    if (this.loadingSituationEvent && !this.loadingSituationEvent.isStopped) {
      return this.loadingSituationEvent.asObservable()
    }
    this.loadingSituationEvent = new Subject<ScheduledSituation[]>()
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
        this.scheduledSituationsEntities = scheduledSituations
        this.loadingSituationEvent.next(scheduledSituations)
        this.loadingSituationEvent.complete()
        this.refreshAllSituationStats().subscribe()
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

  private buildStudentStatistics(situation, appraisals, currentUserId) {
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
    return studentStats
  }

  private buildAppraiserStatistics(situation, appraisals) {
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
    return new AppraiserSituationStatsModel({
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
  }

  private resetService() {
    this.scheduledSituationsEntities = null
    this.statsComputed = null
    this.loadingSituationEvent = null
  }
}
