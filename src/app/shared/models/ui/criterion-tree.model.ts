/**
 * CriterionModel for appraisal
 *
 * Internal model used for display and interaction purpose.
 * This allows to
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning
 */
import { CriterionModel } from '../moodle/criterion.model'

export class CriterionTreeModel {
  criterion: CriterionModel // Moodle internal model for criterion.
  subcriteria?: CriterionTreeModel[]

  /**
   * Convert a list of model into a treemodel list
   * @param criteriaModel
   */
  public static convertToTree(
    criteriaModel: CriterionModel[]
  ): CriterionTreeModel[] {
    const rootCriteria = criteriaModel.filter(
      (criterion) => criterion.parentid == 0
    )
    const buildAllChildren = (parentCriteria) => {
      const allSubcriteria = criteriaModel.filter(
        (criterion) => criterion.parentid == parentCriteria.id
      )
      return new CriterionTreeModel({
        criterion: parentCriteria,
        subcriteria: allSubcriteria.map((subcrit) => buildAllChildren(subcrit)),
      })
    }
    let allHierarchicalCriteria = []
    rootCriteria.forEach((rootc) => {
      allHierarchicalCriteria.push(buildAllChildren(rootc))
    })
    return allHierarchicalCriteria
  }

  constructor(props) {
    Object.assign(this, props)
  }
}
