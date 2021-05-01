import { BaseMoodleModel } from './base-moodle.model'

/**
 * Criteria Eval Grid model (matches criteria and eval grid)
 *
 * Internal model retrieved through Moodle API
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

// This is the replica of the local_cveteval_cevalgrid table, except for the evalgridid that
// is used to get a direct match with the scheduledSituation.
export class CriterionEvalgridModel extends BaseMoodleModel {
  id: number
  criterionid: number
  evalgridid: number
  sort: number
}
