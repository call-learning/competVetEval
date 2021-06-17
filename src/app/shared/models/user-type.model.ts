/**
 * User Type internal model
 *
 * Internal model to manage user type
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

export class UserType {
  type: string

  constructor(input: any) {
    Object.assign(this, input)
  }
}

export const USER_TYPE_APPRAISER = 'appraiser'
export const USER_TYPE_STUDENT = 'student'
export const USER_TYPE_OBSERVER = 'observer'
