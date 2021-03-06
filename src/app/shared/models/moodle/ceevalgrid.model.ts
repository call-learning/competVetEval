/**
 * SituationModel Model
 *
 * Internal model retrieved through Moodle API
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { parseIntMember } from '../../utils/parse-functions'
import { BaseMoodleModel } from './base-moodle.model'

// This is the replica of the local_cveteval_evalgrid table.
export class CeevalgridModel extends BaseMoodleModel {
  id: number
  criterionid: number
  evalgridid: number
  sort: number

  constructor(input) {
    parseIntMember(input, 'id')
    parseIntMember(input, 'criterionid')
    parseIntMember(input, 'evalgridid')
    parseIntMember(input, 'sort')

    super(input)
  }
}
