import { parseIntMember } from '../../utils/parse-functions'
import { BaseMoodleModel } from './base-moodle.model'

/**
 * Evaluation plan Model
 *
 * Internal model for the evaluation plan
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning
 */
// This is the replica of the local_cveteval_evalplan table.
// We do not use lowerCamelCase for entities that are directly retrieved via API
// as Moodle does not use this convention in usual APIs
// We might use lowerCamelCase for attributes that are used internally in the APP though.
export class EvalPlanModel extends BaseMoodleModel {
  id: number
  groupid: number
  clsituationid: number
  starttime: number
  endtime: number

  constructor(input) {
    parseIntMember(input, 'id')
    parseIntMember(input, 'groupid')
    parseIntMember(input, 'clsituationid')
    parseIntMember(input, 'starttime')
    parseIntMember(input, 'endtime')

    super(input)
  }
}
