/**
 * Base Moodle model
 *
 * Base moodle model Moodle API
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { parseIntMember } from '../../utils/parse-functions'

// This is the replica of the local_cveteval_evalgrid table.
export class BaseMoodleModel {
  timecreated: number
  timemodified: number

  constructor(input) {
    parseIntMember(input, 'timecreated')
    parseIntMember(input, 'timemodified')

    Object.assign(this, input)
  }
}
