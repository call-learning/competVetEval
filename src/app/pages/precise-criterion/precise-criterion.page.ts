import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-precise-criterion',
  templateUrl: './precise-criterion.page.html',
  styleUrls: ['./precise-criterion.page.scss'],
})
export class PreciseCriterionPage implements OnInit {
  criterionForm: FormGroup

  errorMsg = ''
  loader: HTMLIonLoadingElement
  isLoading = false

  constructor(
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.criterionForm = this.formBuilder.group({
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

  saveCriterion() {
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
