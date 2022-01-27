import { Injectable } from '@angular/core'

import { of, Observable, Subject } from 'rxjs'
import { first, mergeMap, tap } from 'rxjs/operators'
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

  // If if this not null or not stopped, then we are currently loading, so we need
  // to wait for the process to finish.
  //
  // This is the pattern used in most services:
  // * We prevent double loading of the eval plan by using Subject/Emitter
  // * We either do the actual loading or return the Subject as an Observable
  // then when data is loaded we emit event with the result.
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
   * Force refresh
   */
  public forceRefresh() {
    this.resetService()
    this.refresh().pipe(first()).subscribe()
  }
  /**
   * Refresh all appraisals for the currently logged-in user
   *
   * If user is a student, we will retrieve all appraisal for this student
   * If a user is an appraiser we will retrieve all appraisals that the appraiser is
   * involved in: all appraisal for a plan that the user is involved in
   */
  private refresh(): Observable<EvalPlanModel[]> {
    if (this.loadingEvent && !this.loadingEvent.isStopped) {
      return this.loadingEvent.asObservable()
    }

    this.loadingEvent = new Subject<EvalPlanModel[]>()
    return this.moodleApiService
      .fetchMoreRecentData('evalplan', {}, this.planningEntities)
      .pipe(
        map((evalplans) => {
          const evalplanmodels = evalplans.map(
            (plan) => new EvalPlanModel(plan)
          )
          return evalplanmodels
        }),
        tap((allPlans) => {
          this.loadingEvent.next(allPlans)
          this.planningEntities = allPlans
          this.loadingEvent.complete() // Important : if not event is not emitted.
        })
      )
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
