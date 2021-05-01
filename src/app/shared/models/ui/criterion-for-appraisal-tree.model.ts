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
import { AppraisalCriterionModel } from '../moodle/appraisal-criterion.model'
import { monitorEventLoopDelay } from 'perf_hooks'

export class CriterionForAppraisalTreeModel {
  id?: number
  criterion: CriterionModel // Moodle internal model for criterion.
  comment?: string // Comment attached to this criterion if any.
  grade?: number
  timeModified?: number
  evaluating?: boolean
  subcriteria?: CriterionForAppraisalTreeModel[]

  public get label() {
    return this.criterion.label
  }

  constructor(input: any) {
    Object.assign(this, input)
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
    let model = new CriterionForAppraisalTreeModel({
      criterion: criterion, // Moodle internal model for criterion.
      comment: appraisalCriterionModel.comment
        ? appraisalCriterionModel.comment
        : '',
      timeModified: appraisalCriterionModel.timemodified,
      subcriteria: subcriteria,
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
