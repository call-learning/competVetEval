/**
 * Scheduled situation card for student
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Component, Input, OnInit } from '@angular/core'

import { first } from 'rxjs/operators'
import { ScheduledSituationService } from '../../../core/services/scheduled-situation.service'
import { UserDataService } from '../../../core/services/user-data.service'
import { CevUser } from '../../models/cev-user.model'
import { AppraiserSituationStatsModel } from '../../models/ui/appraiser-situation-stats.model'
import { ScheduledSituation } from '../../models/ui/scheduled-situation.model'

@Component({
  selector: 'app-appraiser-situation-card',
  templateUrl: './appraiser-situation-card.component.html',
  styleUrls: ['./appraiser-situation-card.component.scss'],
})
export class AppraiserSituationCardComponent implements OnInit {
  @Input() scheduledSituation?: ScheduledSituation
  @Input() studentId?: number
  @Input() showHeader = true
  public appraiserSituationStats: AppraiserSituationStatsModel = null
  public studentInfo: CevUser = null

  constructor(
    private scheduledSituationService: ScheduledSituationService,
    private userDataService: UserDataService
  ) {}

  ngOnInit() {
    const evalPlanId = this.scheduledSituation.evalPlan.id
    this.scheduledSituationService
      .getAppraiserScheduledSituationStats(evalPlanId, this.studentId)
      // .pipe(first())
      .subscribe((stats) => (this.appraiserSituationStats = stats))
    this.userDataService
      .getUserProfileInfo(this.studentId)
      .pipe(first())
      .subscribe((userInfo) => (this.studentInfo = userInfo))
  }
}
