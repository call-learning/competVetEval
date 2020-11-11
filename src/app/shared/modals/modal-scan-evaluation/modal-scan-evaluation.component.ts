import { Component, OnInit } from '@angular/core'

import { ModalController, ToastController } from '@ionic/angular'

@Component({
  selector: 'app-modal-scan-evaluation',
  templateUrl: './modal-scan-evaluation.component.html',
  styleUrls: ['./modal-scan-evaluation.component.scss'],
})
export class ModalScanEvaluationComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }

  notImplemented() {
    this.toastController
      .create({
        message: 'Not implemented',
        duration: 2000,
        color: 'danger',
      })
      .then((toast) => {
        toast.present()
      })
  }
}
