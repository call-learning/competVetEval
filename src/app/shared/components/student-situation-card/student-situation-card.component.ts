/**
 * Scheduled situation card for student
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Component, Input, OnInit } from '@angular/core'

import { takeUntil } from 'rxjs/operators'
import { ScheduledSituationService } from '../../../core/services/scheduled-situation.service'
import { ScheduledSituation } from '../../models/ui/scheduled-situation.model'
import { StudentSituationStatsModel } from '../../models/ui/student-situation-stats.model'
import { BaseComponent } from '../base/base.component'

@Component({
  selector: 'app-student-situation-card',
  templateUrl: './student-situation-card.component.html',
  styleUrls: ['./student-situation-card.component.scss'],
})
export class StudentSituationCardComponent
  extends BaseComponent
  implements OnInit
{
  @Input() scheduledSituation?: ScheduledSituation
  @Input() showHeader = true
  public studentSituationStats: StudentSituationStatsModel = null

  constructor(private scheduledSituationService: ScheduledSituationService) {
    super()
  }

  ngOnInit() {
    const evalPlanId = this.scheduledSituation.evalPlan.id
    this.scheduledSituationService
      .getMyScheduledSituationStats(evalPlanId)
      .pipe(takeUntil(this.alive$))
      .subscribe((stats) => {
        this.studentSituationStats = stats
      })
  }
}
