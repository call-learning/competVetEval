/**
 * Idp
 *
 * Internal model for Idp
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning
 */

export class IdpModel {
  url: string
  name: string
  iconurl?: string

  constructor(input) {
    Object.assign(this, input)
  }
}
