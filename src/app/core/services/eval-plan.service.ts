import { Injectable } from '@angular/core'

import { of, Observable, Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { map } from 'rxjs/operators'
import { EvalPlanModel } from '../../shared/models/moodle/eval-plan.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService, LOGIN_STATE } from './auth.service'
import { BaseDataService } from './base-data.service'
import { SituationModel } from '../../shared/models/moodle/situation.model'
/**
 * Load user evaluation plans
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

@Injectable({
  providedIn: 'root',
})
export class EvalPlanService {
  private planningEntities: EvalPlanModel[] = null

  // If if this not null, then we are currently loading, so we need
  // to wait for the process to finish.
  private loadingEvent: Subject<EvalPlanModel[]> = null

  /**
   * Constructor
   *
   * @param moodleApiService
   * @param authService
   */
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService,
    private baseDataService: BaseDataService
  ) {
    // Subscribe for the the whole service lifetime
    this.authService.loginState$.subscribe((loginState) => {
      if (loginState !== LOGIN_STATE.LOGGED) {
        this.resetService()
      }
    })
  }

  /**
   * Retrieve appraisals for currently logged-in user
   */
  public get plans$(): Observable<EvalPlanModel[]> {
    if (this.planningEntities === null) {
      return this.refresh()
    } else {
      return of(this.planningEntities)
    }
  }

  /**
   * Retrieve appraisal from its Id
   */
  public planFromId(evalplanId): Observable<EvalPlanModel> {
    return this.plans$.pipe(
      map((evalplans) => evalplans.find((plan) => plan.id === evalplanId))
    )
  }
  /**
   * Get Eval Grid Id from a given evalPlanId
   * @param evalPlanId
   */
  public getEvalGridIdFromEvalPlanId(evalPlanId): Observable<number> {
    return this.plans$.pipe(
      map((plans) => plans.find((p) => p.id === evalPlanId)),
      mergeMap((plan: EvalPlanModel) => {
        if (plan) {
          return this.baseDataService.situations$.pipe(
            map((situations) =>
              situations.find((s) => s.id === plan.clsituationid)
            )
          )
        }
        return of(null)
      }),
      map((situation) => (!situation ? 1 : situation.evalgridid))
    )
  }
  /**
   * Refresh all appraisals for the currently logged-in user
   *
   * If user is a student, we will retrieve all appraisal for this student
   * If a user is an appraiser we will retrieve all appraisals that the appraiser is
   * involved in: all appraisal for a plan that the user is involved in
   */
  private refresh(): Observable<EvalPlanModel[]> {
    if (!this.loadingEvent || this.loadingEvent.isStopped) {
      this.loadingEvent = new Subject<EvalPlanModel[]>()
      this.moodleApiService
        .fetchMoreRecentData('evalplan', {}, this.planningEntities)
        .pipe(
          map((evalplans) => {
            const evalplanmodels = evalplans.map(
              (plan) => new EvalPlanModel(plan)
            )
            return evalplanmodels
          })
        )
        .subscribe((allPlans) => {
          this.loadingEvent.next(allPlans)
          this.planningEntities = allPlans
          this.loadingEvent.complete() // Important : if not event is not emitted.
        })
    }
    return this.loadingEvent.asObservable()
  }

  /**
   * Reset Service
   * @protected
   */
  private resetService() {
    this.planningEntities = null
    this.loadingEvent = null
  }
}
