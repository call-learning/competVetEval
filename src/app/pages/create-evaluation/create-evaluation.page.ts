import { Component, OnInit } from '@angular/core'

import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-create-evaluation',
  templateUrl: './create-evaluation.page.html',
  styleUrls: ['./create-evaluation.page.scss'],
})
export class CreateEvaluationPage implements OnInit {
  constructor(private toastController: ToastController) {}

  ngOnInit() {}

  help() {
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
