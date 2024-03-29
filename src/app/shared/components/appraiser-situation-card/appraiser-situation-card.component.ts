import { Component, Input, OnInit } from '@angular/core'

import { ScheduledSituationService } from '../../../core/services/scheduled-situation.service'
import { UserDataService } from '../../../core/services/user-data.service'
import { CevUser } from '../../models/cev-user.model'
import { ScheduledSituation } from '../../models/ui/scheduled-situation.model'
import { BaseComponent } from './../base/base.component'
/**
 * Scheduled situation card for student
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

@Component({
  selector: 'app-appraiser-situation-card',
  templateUrl: './appraiser-situation-card.component.html',
  styleUrls: ['./appraiser-situation-card.component.scss'],
})
export class AppraiserSituationCardComponent
  extends BaseComponent
  implements OnInit
{
  @Input() scheduledSituation?: ScheduledSituation
  @Input() studentId?: number
  @Input() showHeader = true
  public studentInfo: CevUser = null

  constructor(
    private scheduledSituationService: ScheduledSituationService,
    private userDataService: UserDataService
  ) {
    super()
  }

  ngOnInit() {
    this.userDataService
      .getUserProfileInfo(this.studentId)
      .subscribe((userInfo) => (this.studentInfo = userInfo))
  }
}
