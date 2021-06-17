/**
 * Modal for criterion details
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Component, Input, OnInit } from '@angular/core'

import { ModalController } from '@ionic/angular'

import { CriterionForAppraisalTreeModel } from '../../models/ui/criterion-for-appraisal-tree.model'

@Component({
  selector: 'app-modal-modal-criterion-detail',
  templateUrl: './modal-criterion-detail.component.html',
  styleUrls: ['./modal-criterion-detail.component.scss'],
})
export class ModalCriterionDetailComponent implements OnInit {
  @Input() criterion: CriterionForAppraisalTreeModel

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }
}
