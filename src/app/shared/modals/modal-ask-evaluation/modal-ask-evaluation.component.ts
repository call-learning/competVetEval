import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ModalController, ToastController } from '@ionic/angular'

@Component({
  selector: 'app-modal-ask-evaluation',
  templateUrl: './modal-ask-evaluation.component.html',
  styleUrls: ['./modal-ask-evaluation.component.scss'],
})
export class ModalAskEvaluationComponent implements OnInit {
  @Input() rotation: any

  askEvaluationForm: FormGroup

  errorMsg = ''

  formSubmitted = false

  step: 'context' | 'qr-code' = 'context'

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
    this.askEvaluationForm = this.formBuilder.group({
      context: ['', [Validators.required]],
    })
  }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }

  nextStep() {
    this.errorMsg = ''
    this.formSubmitted = true

    if (this.askEvaluationForm.valid) {
      this.step = 'qr-code'
    } else {
      this.errorMsg = 'Le formulaire est invalide'
    }
  }

  previousStep() {
    this.step = 'context'
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
