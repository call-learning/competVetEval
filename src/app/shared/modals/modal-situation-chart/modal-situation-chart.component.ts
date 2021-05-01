/**
 * Situation chart modal
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Component, Input, OnInit } from '@angular/core'

import { ModalController } from '@ionic/angular'

import { AppraisalUI } from '../../models/ui/appraisal-ui.model'

@Component({
  selector: 'app-modal-situation-chart',
  templateUrl: './modal-situation-chart.component.html',
  styleUrls: ['./modal-situation-chart.component.scss'],
})
export class ModalSituationChartComponent implements OnInit {
  @Input() appraisals: AppraisalUI[]
  @Input() labels: String[]

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }
}
