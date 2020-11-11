import { Component, Input, OnInit } from '@angular/core'

import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-modal-modal-criterion-detail',
  templateUrl: './modal-criterion-detail.component.html',
  styleUrls: ['./modal-criterion-detail.component.scss'],
})
export class ModalCriterionDetailComponent implements OnInit {
  @Input() criterion: any

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }
}
