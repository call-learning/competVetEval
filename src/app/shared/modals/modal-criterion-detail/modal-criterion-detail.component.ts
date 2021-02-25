import { Component, Input, OnInit } from '@angular/core'

import { ModalController } from '@ionic/angular'

import { CriterionAppraisal } from '../../models/criterion-appraisal.model'

@Component({
  selector: 'app-modal-modal-criterion-detail',
  templateUrl: './modal-criterion-detail.component.html',
  styleUrls: ['./modal-criterion-detail.component.scss'],
})
export class ModalCriterionDetailComponent implements OnInit {
  @Input() criterion: CriterionAppraisal

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }
}
