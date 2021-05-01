/**
 * AppraisalCriterionModel Model
 *
 * Internal model retrieved through Moodle API
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { BaseMoodleModel } from './base-moodle.model'
import { CriterionModel } from './criterion.model'

// This is the replica of the local_cveteval_appr_crit table.
export class AppraisalCriterionModel extends BaseMoodleModel {
  id?: number
  criterionid: number
  appraisalid?: number
  grade: number
  comment: string
  commentformat: number

  public static createFromCriterionModel(criterionModel: CriterionModel) {
    return new AppraisalCriterionModel({
      criterionid: criterionModel.id,
      grade: 0,
      comment: '',
      commentformat: 1,
    })
  }
}
