import { AuthService, LOGIN_STATE } from './auth.service'
import { filter, tap } from 'rxjs/operators'
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

import { BehaviorSubject, forkJoin, Observable, of, zip } from 'rxjs'
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
  private criteriaTreeEntities: CriterionTreeModel[] = null

  /**
   * Build the base data service
   *
   * @param baseDataService
   * @param authService
   */
  constructor(
    private baseDataService: BaseDataService,
    private authService: AuthService
  ) {
    this.authService.loginState$.subscribe((loginState) => {
      if (loginState !== LOGIN_STATE.LOGGED) {
        this.resetService()
      }
    })
  }

  resetService() {
    this.criteriaTreeEntities = null
  }

  /**
   * Get current criteria tree
   */
  public get criteriaTree$(): Observable<CriterionTreeModel[]> {
    if (this.criteriaTreeEntities === null) {
      return this.refreshCriteria()
    } else {
      return of(this.criteriaTreeEntities)
    }
  }

  /**
   * Build a tree model of criteria from a flat list
   *
   * @param newcriteria
   */
  public refreshCriteria(): Observable<CriterionTreeModel[]> {
    return this.baseDataService.criteria$.pipe(
      map((newcriteria) => {
        const allHierarchicalCriteria =
          CriterionTreeModel.convertToTree(newcriteria)
        this.criteriaTreeEntities = allHierarchicalCriteria
        return allHierarchicalCriteria
      })
    )
  }

  /**
   * Get criteria from eval Grid
   * @param evalgridId
   */
  public getCriteriaFromEvalGrid(
    evalgridId: number
  ): Observable<CriterionModel[]> {
    return forkJoin([
      this.baseDataService.criteriaEvalGrid$,
      this.baseDataService.criteria$,
    ]).pipe(
      map(([criteriaEvalGrid, criteria]) => {
        return criteriaEvalGrid
          .filter((evalGridCrit) => evalGridCrit.evalgridid === evalgridId)
          .map((evalGridCrit) => {
            return criteria.find((crit) => {
              return crit.id === evalGridCrit.id
            })
          })
      })
    )
  }
}
