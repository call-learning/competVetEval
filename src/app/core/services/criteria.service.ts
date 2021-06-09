import { filter } from 'rxjs/operators'
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

import { Injectable } from '@angular/core'

import { BehaviorSubject, Observable, of, zip } from 'rxjs'
import { concatMap, first, map, withLatestFrom } from 'rxjs/operators'
import { CriterionModel } from '../../shared/models/moodle/criterion.model'
import { CriterionTreeModel } from '../../shared/models/ui/criterion-tree.model'
import { BaseDataService } from './base-data.service'

/**
 * Manage criteria hierarchical view
 * - criteria / evaluation grid
 */
@Injectable({
  providedIn: 'root',
})
export class CriteriaService {
  private criteriaTreeEntities$ = new BehaviorSubject<CriterionTreeModel[]>(
    null
  )

  /**
   * Build the base data service
   *
   * @param baseDataService
   * @param authService
   */
  constructor(private baseDataService: BaseDataService) {
    this.baseDataService.criteria$
      .pipe(filter((res) => !!res))
      .subscribe((newcriteria) => {
        this.refreshCriteria(newcriteria)
      })
  }

  /**
   * Get current criteria tree
   */
  public get criteriaTree$(): Observable<CriterionTreeModel[]> {
    return this.criteriaTreeEntities$.asObservable()
  }

  /**
   * Build a tree model of criteria from a flat list
   *
   * @param newcriteria
   */
  public refreshCriteria(newcriteria: CriterionModel[]): CriterionTreeModel[] {
    const allHierarchicalCriteria =
      CriterionTreeModel.convertToTree(newcriteria)
    this.criteriaTreeEntities$.next(allHierarchicalCriteria)
    return allHierarchicalCriteria
  }

  /**
   * Get criteria from eval Grid
   * @param evalgridId
   */
  public getCriteriaFromEvalGrid(
    evalgridId: number
  ): Observable<CriterionModel[]> {
    return zip(
      this.baseDataService.criteria$.pipe(filter((res) => !!res)),
      this.baseDataService.criteriaEvalgrid$.pipe(filter((res) => !!res))
    ).pipe(
      first(),
      map(([allCriteria, allCriteriaEvalGrid]) => {
        return allCriteriaEvalGrid
          .filter((evalGridCrit) => evalGridCrit.evalgridid === evalgridId)
          .map((evalGridCrit) => {
            return allCriteria.find((criteria) => {
              return criteria.id === evalGridCrit.id
            })
          })
      })
    )
  }
}
