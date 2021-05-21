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

import { BehaviorSubject, Observable } from 'rxjs'
import { CriterionModel } from '../../shared/models/moodle/criterion.model'
import { BaseMoodleModel } from '../../shared/models/moodle/base-moodle.model'
import { Injectable } from '@angular/core'
import { map, mergeMap } from 'rxjs/operators'
import { CevUser } from '../../shared/models/cev-user.model'
import { RoleModel } from '../../shared/models/moodle/role.model'
import { GroupAssignmentModel } from '../../shared/models/moodle/group-assignment.model'
import { CriterionTreeModel } from '../../shared/models/ui/criterion-tree.model'
import { BaseDataService } from './base-data.service'
import { root } from 'rxjs/internal-compatibility'

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
    this.baseDataService.criteria$.subscribe((newcriteria) => {
      this.refreshCriteria(newcriteria)
    })
  }

  /**
   * Get current criteria tree
   */
  public get criteriaTree$(): BehaviorSubject<CriterionTreeModel[]> {
    return this.criteriaTreeEntities$
  }

  /**
   * Build a tree model of criteria from a flat list
   *
   * @param newcriteria
   */
  public refreshCriteria(newcriteria: CriterionModel[]): CriterionTreeModel[] {
    if (newcriteria) {
      const allHierarchicalCriteria =
        CriterionTreeModel.convertToTree(newcriteria)
      this.criteriaTreeEntities$.next(allHierarchicalCriteria)
      return allHierarchicalCriteria
    }
  }

  /**
   * Get criteria from eval Grid
   * @param evalgridId
   */
  public getCriteriaFromEvalGrid(evalgridId: number): CriterionModel[] {
    const allCriteria = this.baseDataService.criteria$.getValue()
    return this.baseDataService.criteriaEvalgrid$
      .getValue()
      .filter((ce) => ce.evalgridid == evalgridId)
      .map((evalgridcrit) =>
        allCriteria.find((c) => c.id == evalgridcrit.criterionid)
      )
  }
}
