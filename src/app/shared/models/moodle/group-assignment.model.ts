import { parseIntMember } from '../../utils/parse-functions'
import { BaseMoodleModel } from './base-moodle.model'

/**
 * Group Assignment model
 *
 * Internal model retrieved through Moodle API
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
// nnkitodo[FILE]
// This is the replica of the local_cveteval_group_assign table.
// We do not use lowerCamelCase for entities that are directly retrieved via API
// as Moodle does not use this convention in usual APIs
// We might use lowerCamelCase for attributes that are used internally in the APP though.
export class GroupAssignmentModel extends BaseMoodleModel {
  id: number
  studentid: number
  groupid: number

  constructor(input) {
    parseIntMember(input, 'id')
    parseIntMember(input, 'studentid')
    parseIntMember(input, 'groupid')

    super(input)
  }
}
