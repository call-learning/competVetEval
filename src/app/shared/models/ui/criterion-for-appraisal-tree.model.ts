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
import { parseBooleanMember, parseIntMember } from '../../utils/parse-functions'
import { AppraisalCriterionModel } from '../moodle/appraisal-criterion.model'
import { CriterionModel } from '../moodle/criterion.model'
// nnkitodo[FILE]
export class CriterionForAppraisalTreeModel {
  id?: number
  criterion: CriterionModel // Moodle internal model for criterion.
  comment?: string // Comment attached to this criterion if any.
  grade?: number
  timeModified?: number
  evaluating?: boolean
  subcriteria?: CriterionForAppraisalTreeModel[]

  constructor(input: any) {
    parseIntMember(input, 'id')
    parseIntMember(input, 'grade')
    parseIntMember(input, 'timeModified')
    parseBooleanMember(input, 'evaluating')

    Object.assign(this, input)

    if (this.criterion) {
      this.criterion = new CriterionModel(this.criterion)
    }

    if (this.subcriteria) {
      this.subcriteria = this.subcriteria.map((child) => {
        return new CriterionForAppraisalTreeModel(child)
      })
    } else {
      this.subcriteria = []
    }
  }

  public get label() {
    return this.criterion.label
  }

  /**
   * Build from appraisal criteria model
   * @param appraisalCriterionModel
   * @param criterion
   * @param subcriteria
   */
  static fromAppraisalCriterionModel(
    appraisalCriterionModel: AppraisalCriterionModel,
    criterion: CriterionModel,
    subcriteria: CriterionForAppraisalTreeModel[]
  ) {
    const model = new CriterionForAppraisalTreeModel({
      criterion, // Moodle internal model for criterion.
      comment: appraisalCriterionModel.comment
        ? appraisalCriterionModel.comment
        : '',
      timeModified: appraisalCriterionModel.timemodified,
      subcriteria,
    })
    if (appraisalCriterionModel.id) {
      model.id = appraisalCriterionModel.id
    }
    if (appraisalCriterionModel.grade) {
      model.grade = appraisalCriterionModel.grade
    }
    return model
  }
}
