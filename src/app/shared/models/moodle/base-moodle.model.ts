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

// This is the replica of the local_cveteval_evalgrid table.
export class BaseMoodleModel {
  timecreated: number
  timemodified: number

  constructor(input) {
    Object.assign(this, input)
  }
}
