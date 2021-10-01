/**
 * AppraisalUI model
 *
 * Internal model for appraisail
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning
 */
// nnkitodo[FILE]
import { parseIntMember } from '../../utils/parse-functions'
import { CevUser } from '../cev-user.model'
import { EvalPlanModel } from '../moodle/eval-plan.model'
import { CriterionForAppraisalTreeModel } from './criterion-for-appraisal-tree.model'

// This entity is deduced from several API calls to Moodle and compiled in the App
// We use lowerCamelCase in entities that are directly retrieved via API (like this one which
// is deduced from several calls to the APIs).
export class AppraisalUI {
  id?: number // Not set at creation.
  student: CevUser
  appraiser: CevUser
  evalPlan: EvalPlanModel
  context: string
  comment: string
  criteria: CriterionForAppraisalTreeModel[]
  timeModified: number

  constructor(input: any) {
    parseIntMember(input, 'id')
    parseIntMember(input, 'timeModified')

    Object.assign(this, input)

    if (this.student) {
      this.student = new CevUser(this.student)
    }

    if (this.appraiser) {
      this.appraiser = new CevUser(this.appraiser)
    }

    if (this.evalPlan) {
      this.evalPlan = new EvalPlanModel(this.evalPlan)
    }

    if (this.criteria) {
      this.criteria = this.criteria.map((child) => {
        return new CriterionForAppraisalTreeModel(child)
      })
    } else {
      this.criteria = []
    }
  }
}
