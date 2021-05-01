/**
 * Load user evaluation plans
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService } from './auth.service'
import { EvalPlanModel } from '../../shared/models/moodle/eval-plan.model'
import { map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class EvalPlanService {
  protected planningEntities = new BehaviorSubject<EvalPlanModel[]>(null)

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
    this.authService.loggedUser.subscribe((cveUser) => {
      if (cveUser) {
        this.refresh().subscribe()
      } else {
        this.planningEntities.next(null)
      }
    })
  }

  /**
   * Retrieve appraisals for currently logged in user
   */
  public get plans(): BehaviorSubject<EvalPlanModel[]> {
    return this.planningEntities
  }

  /**
   * Retrieve appraisal from its Id
   */
  public planFromId(evalplanId): Observable<EvalPlanModel> {
    return this.planningEntities.pipe(
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
    return this.moodleApiService
      .fetchIfMoreRecent('evalplan', {}, this.planningEntities.getValue())
      .pipe(
        map((evalplans) => {
          const evalplanmodels = evalplans.map(
            (plan) => new EvalPlanModel(plan)
          )
          this.planningEntities.next(evalplanmodels)
          return evalplanmodels
          //this.planningEntities.complete()
        })
      )
  }
}
