/**
 * Scheduled situation card for student
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-situation-status-icon',
  templateUrl: './situation-status-icon.component.html',
})
export class SituationStatusIconComponent {
  @Input() status: string

  constructor() {}
}
