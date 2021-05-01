/**
 * Login result model
 *
 * Internal model for login token exchange
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning
 */

export class LoginResult {
  token?: string

  errorcode?: string

  constructor(input) {
    Object.assign(this, input)
  }
}
