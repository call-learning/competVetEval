import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-start-evaluation',
  templateUrl: './start-evaluation.page.html',
  styleUrls: ['./start-evaluation.page.scss'],
})
export class StartEvaluationPage implements OnInit {
  evaluationForm: FormGroup

  errorMsg = ''
  loader: HTMLIonLoadingElement
  isLoading = false

  constructor(
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.evaluationForm = this.formBuilder.group({
      context: ['', [Validators.required]],
      comments: ['', [Validators.required]],
    })
  }

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

  evaluate() {
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
