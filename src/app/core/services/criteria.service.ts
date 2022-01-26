import { EventEmitter, Injectable } from '@angular/core'

import { of, Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { CriterionModel } from '../../shared/models/moodle/criterion.model'
import { CriterionTreeModel } from '../../shared/models/ui/criterion-tree.model'
import { AuthService, LOGIN_STATE } from './auth.service'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { EvalPlanModel } from '../../shared/models/moodle/eval-plan.model'

/**
 * Criteria based services
 *
 * Used to manage criteria related routines
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

/**
 * Manage criteria hierarchical view
 * - criteria / evaluation grid
 */
@Injectable({
  providedIn: 'root',
})
export class CriteriaService {
  private criteriaTreeEntities: Map<number, CriterionTreeModel[]> = new Map<
    number,
    CriterionTreeModel[]
  >()
  private criteriaList: Map<number, CriterionModel[]> = new Map<
    number,
    CriterionModel[]
  >()
  private loadingEvents: Map<
    number,
    EventEmitter<[CriterionTreeModel[], CriterionModel[]]>
  > = new Map<number, EventEmitter<[CriterionTreeModel[], CriterionModel[]]>>()
  /**
   * Build the base data service
   *
   * @param authService
   * @param moodleApiService
   */
  constructor(
    private authService: AuthService,
    private moodleApiService: MoodleApiService
  ) {
    this.authService.loginState$.subscribe((loginState) => {
      if (loginState !== LOGIN_STATE.LOGGED) {
        this.resetService()
      }
    })
  }

  /**
   * Get current criteria tree or wait for it to be loaded.
   */
  public getCriteriaTree(evalGridId: number): Observable<CriterionTreeModel[]> {
    const result = this.criteriaTreeEntities.get(evalGridId)
    if (result === undefined) {
      return this.refresh(evalGridId).pipe(
        map(([criterionTreeModels, criteriaList]) => criterionTreeModels)
      )
    } else {
      return of(result)
    }
  }

  /**
   * Get criteria from eval Grid
   * @param evalgridId
   */
  public getCriteria(evalgridId: number): Observable<CriterionModel[]> {
    return this.refresh(evalgridId).pipe(
      map(([criterionTreeModels, criteriaList]) => criteriaList)
    )
  }

  /**
   * Reset service
   * @protected
   */
  protected resetService() {
    this.criteriaTreeEntities.clear()
    this.criteriaList.clear()
    this.loadingEvents.clear()
  }
  /**
   * Build a tree model of criteria from a flat list
   * @return Observable<CriterionTreeModel[]
   */
  protected refresh(
    evalGridId
  ): Observable<[CriterionTreeModel[], CriterionModel[]]> {
    let loadingEvent = this.loadingEvents.get(evalGridId)
    if (!loadingEvent) {
      loadingEvent = new EventEmitter<
        [CriterionTreeModel[], CriterionModel[]]
      >()
      this.loadingEvents.set(evalGridId, loadingEvent)

      let query = { evalgridid: evalGridId }
      this.moodleApiService
        .fetchMoreRecentData(
          'criterion',
          query,
          this.criteriaList.get(evalGridId)
        )
        .pipe(
          map((newCriteriaList: Object[]) =>
            newCriteriaList.map((obj) => new CriterionModel(obj))
          ),
          tap((newCriteriaList: CriterionModel[]) => {
            this.criteriaList.set(evalGridId, newCriteriaList)
          })
        )
        .subscribe((newCriteriaList: CriterionModel[]) => {
          const allHierarchicalCriteria =
            CriterionTreeModel.convertToTree(newCriteriaList)
          this.criteriaTreeEntities.set(evalGridId, allHierarchicalCriteria)
          loadingEvent.emit([allHierarchicalCriteria, newCriteriaList])
          loadingEvent.complete()
          this.loadingEvents.delete(evalGridId)
        })
    }
    return loadingEvent.asObservable()
  }
}
