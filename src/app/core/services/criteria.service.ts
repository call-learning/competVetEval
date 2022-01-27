import { EventEmitter, Injectable } from '@angular/core'

import { of, Observable, Subject } from 'rxjs'
import { concatMap, first, map, mapTo, tap } from 'rxjs/operators'
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
    Subject<[CriterionTreeModel[], CriterionModel[]]>
  > = new Map<number, Subject<[CriterionTreeModel[], CriterionModel[]]>>()

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
  private resetService() {
    this.criteriaTreeEntities.clear()
    this.criteriaList.clear()
    this.loadingEvents.clear()
  }

  public forceRefresh() {
    const evalGrids = this.criteriaList.keys()
    this.resetService()
    if (evalGrids) {
      Array.from(evalGrids).forEach((evalGridId) =>
        this.refresh(evalGridId).pipe(first()).subscribe()
      )
    }
  }

  /**
   * Build a tree model of criteria from a flat list
   * @return Observable<CriterionTreeModel[]
   */
  private refresh(
    evalGridId
  ): Observable<[CriterionTreeModel[], CriterionModel[]]> {
    let loadingEvent = this.loadingEvents.get(evalGridId)
    if (loadingEvent && !loadingEvent.isStopped) {
      return loadingEvent.asObservable()
    }
    loadingEvent = new Subject<[CriterionTreeModel[], CriterionModel[]]>()
    this.loadingEvents.set(evalGridId, loadingEvent)

    let query = { evalgridid: evalGridId }
    return this.moodleApiService
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
        }),
        map((newCriteriaList: CriterionModel[]) => {
          const allHierarchicalCriteria =
            CriterionTreeModel.convertToTree(newCriteriaList)
          const returnedValue = [allHierarchicalCriteria, newCriteriaList]
          this.criteriaTreeEntities.set(evalGridId, allHierarchicalCriteria)
          loadingEvent.next([allHierarchicalCriteria, newCriteriaList])
          loadingEvent.complete()
          this.loadingEvents.delete(evalGridId)
          return [allHierarchicalCriteria, newCriteriaList]
        })
      )
  }
}
