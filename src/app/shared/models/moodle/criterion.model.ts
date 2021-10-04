/**
 * CriterionModel Model
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

// This is the replica of the local_cveteval_clsituation table.
export class CriterionModel extends BaseMoodleModel {
  id: number
  label: string
  idnumber: string
  parentid: number
  sort: number

  constructor(input) {
    parseIntMember(input, 'id')
    parseIntMember(input, 'parentid')
    parseIntMember(input, 'sort')

    super(input)
  }
}
