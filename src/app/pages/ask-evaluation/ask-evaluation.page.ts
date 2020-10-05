import { Component, OnInit } from '@angular/core'

import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-ask-evaluation',
  templateUrl: './ask-evaluation.page.html',
  styleUrls: ['./ask-evaluation.page.scss'],
})
export class AskEvaluationPage implements OnInit {
  constructor(private toastController: ToastController) {}

  ngOnInit() {}

  more() {
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
