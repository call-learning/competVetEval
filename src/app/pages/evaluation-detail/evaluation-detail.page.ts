import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ToastController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'

@Component({
  selector: 'app-evaluation-detail',
  templateUrl: './evaluation-detail.page.html',
  styleUrls: ['./evaluation-detail.page.scss'],
})
export class EvaluationDetailPage implements OnInit {
  answerEvaluationForm: FormGroup

  errorMsg = ''
  loader: HTMLIonLoadingElement
  isLoading = false

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    public authService: AuthService
  ) {
    this.answerEvaluationForm = this.formBuilder.group({
      answer: ['', [Validators.required]],
    })
  }

  ngOnInit() {}

  answerEvaluation() {
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
