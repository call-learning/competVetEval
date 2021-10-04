import { concatMap, exhaustMap, finalize, first, tap } from 'rxjs/operators'
/**
 * Load user evaluation plans
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Injectable } from '@angular/core'

import { BehaviorSubject, Observable, of } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { EvalPlanModel } from '../../shared/models/moodle/eval-plan.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService, LOGIN_STATE } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class EvalPlanService {
  private planningEntities: EvalPlanModel[] = null

  private isLoaded$ = new BehaviorSubject<boolean>(false)
  private isLoading = false

  /**
   * Constructor
   *
   * @param moodleApiService
   * @param authService
   */
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService
  ) {
    // Subscribe for the the whole service lifetime
    this.authService.loginState$.subscribe((loginState) => {
      if (loginState !== LOGIN_STATE.LOGGED) {
        this.resetService()
      }
    })
  }

  resetService() {
    this.planningEntities = null
    this.isLoaded$.next(false)
    this.isLoading = false
  }

  /**
   * Retrieve appraisals for currently logged in user
   */
  public get plans$(): Observable<EvalPlanModel[]> {
    if (this.planningEntities === null) {
      if (!this.isLoading) {
        return this.refresh().pipe(
          tap(() => {
            this.isLoading = false
            this.isLoaded$.next(true)
          })
        )
      } else {
        return this.isLoaded$.pipe(
          filter((isLoaded) => !!isLoaded),
          first(),
          map(() => {
            return this.planningEntities
          })
        )
      }
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
   * Refresh all appraisals for the currently logged in user
   *
   * If user is a student, we will retrieve all appraisal for this student
   * If a user is an appraiser we will retrieve all appraisals that the appraiser is
   * involved in: all appraisal for a plan that the user is involved in
   */
  public refresh(): Observable<EvalPlanModel[]> {
    this.isLoading = true
    console.log('initiate refresh eval plans')
    return this.moodleApiService
      .fetchMoreRecentData('evalplan', {}, this.planningEntities)
      .pipe(
        map((evalplans) => {
          const evalplanmodels = evalplans.map(
            (plan) => new EvalPlanModel(plan)
          )
          this.planningEntities = evalplanmodels
          console.log('refresh eval plans', evalplanmodels)
          return evalplanmodels
        })
      )
  }
}
