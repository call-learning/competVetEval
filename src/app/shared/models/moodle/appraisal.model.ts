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
// nnkitodo[FILE]
// This is the replica of the local_cveteval_clsituation table.
// We do not use lowerCamelCase for entities that are directly retrieved via API
// as Moodle does not use this convention in usual APIs
// We might use lowerCamelCase for attributes that are used internally in the APP though.
export class AppraisalModel extends BaseMoodleModel {
  id?: number
  studentid: number
  appraiserid: number
  evalplanid: number
  context: string
  contextformat: number
  comment: string
  commentformat: number

  constructor(input) {
    parseIntMember(input, 'id')
    parseIntMember(input, 'studentid')
    parseIntMember(input, 'appraiserid')
    parseIntMember(input, 'evalplanid')
    parseIntMember(input, 'contextformat')
    parseIntMember(input, 'commentformat')

    super(input)
  }

  public static createBlank(
    studentid: number,
    appraiserid: number,
    evalplanid: number,
    comment?: string,
    context?: string
  ) {
    return new AppraisalModel({
      studentid,
      appraiserid,
      evalplanid,
      contextformat: 1,
      context: context ? context : '',
      comment: comment ? comment : '',
      commentformat: 1,
    })
  }
}
