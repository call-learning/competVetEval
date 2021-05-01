/**
 * School Model
 *
 * Internal model used to manage school information
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

export class School {
  id: string
  name: string
  logo: string
  moodleUrl: string

  constructor(input: any) {
    Object.assign(this, input)
  }
}
