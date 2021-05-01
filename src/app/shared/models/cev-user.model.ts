/**
 * User Information Model
 *
 * Internal model for a given user
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning
 */

export class CevUser {
  userid: number
  fullname?: string
  firstname?: string
  lastname?: string
  username?: string
  userpictureurl?: string

  constructor(input: any) {
    Object.assign(this, input)
  }
}
