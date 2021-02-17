import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ModalController, ToastController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'
import { ModalCriterionDetailComponent } from 'src/app/shared/modals/modal-criterion-detail/modal-criterion-detail.component'

@Component({
  selector: 'app-evaluation-detail',
  templateUrl: './evaluation-detail.page.html',
  styleUrls: ['./evaluation-detail.page.scss'],
})
export class EvaluationDetailPage implements OnInit {
  answerEvaluationForm: FormGroup

  errorMsg = ''

  formSubmitted = false

  evaluation: any

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    public authService: AuthService,
    private modalController: ModalController
  ) {
    this.answerEvaluationForm = this.formBuilder.group({
      answer: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.evaluation = {
      situationTitle: 'Situation chirurgie technique',
      context:
        'Situation effectuée en hopital vétérinaire sur animaux de companie',
      criteria: [
        {
          title: 'Savoir être, qualités personnelles et professionnelles',
          evaluated: '3/4',
          comments: '1',
          grade: 5,
          subcriteria: [
            {
              title: 'Ponctualité',
              grade: 5,
            },
            {
              title: 'Ponctualité',
              grade: 2,
            },
            {
              title: 'Ponctualité',
              grade: null,
            },
          ],
          comment: 'Définitivement un atout !',
        },
        {
          title: 'Savoir être, qualités personnelles et professionnelles',
          evaluated: '3/4',
          comments: '1',
          grade: 4,
          subcriteria: [
            {
              title: 'Ponctualité',
              grade: 5,
            },
            {
              title: 'Ponctualité',
              grade: 2,
            },
            {
              title: 'Ponctualité',
              grade: null,
            },
          ],
          comment: 'Définitivement un atout !',
        },
        {
          title: 'Savoir être, qualités personnelles et professionnelles',
          evaluated: '3/4',
          comments: '1',
          grade: 3,
          subcriteria: [
            {
              title: 'Ponctualité',
              grade: 5,
            },
            {
              title: 'Ponctualité',
              grade: 2,
            },
            {
              title: 'Ponctualité',
              grade: null,
            },
          ],
          comment: 'Définitivement un atout !',
        },
        {
          title: 'Savoir être, qualités personnelles et professionnelles',
          evaluated: '3/4',
          comments: '1',
          grade: 2,
          subcriteria: [
            {
              title: 'Ponctualité',
              grade: 5,
            },
            {
              title: 'Ponctualité',
              grade: 2,
            },
            {
              title: 'Ponctualité',
              grade: null,
            },
          ],
          comment: 'Définitivement un atout !',
        },
        {
          title: 'Savoir être, qualités personnelles et professionnelles',
          evaluated: '3/4',
          comments: '1',
          grade: 1,
          subcriteria: [
            {
              title: 'Ponctualité',
              grade: 5,
            },
            {
              title: 'Ponctualité',
              grade: 2,
            },
            {
              title: 'Ponctualité',
              grade: null,
            },
          ],
          comment: 'Définitivement un atout !',
        },
        {
          title: 'Savoir être, qualités personnelles et professionnelles',
          evaluated: '3/4',
          comments: '1',
          grade: null,
          subcriteria: [
            {
              title: 'Ponctualité',
              grade: 5,
            },
            {
              title: 'Ponctualité',
              grade: 2,
            },
            {
              title: 'Ponctualité',
              grade: null,
            },
          ],
          comment: 'Définitivement un atout !',
        },
      ],
      comment:
        'Courageux,  autonome, Michelle a fait preuve de tenacité pendant cette situation.',
    }
  }

  openModalCriterionDetail(criterion) {
    this.modalController
      .create({
        component: ModalCriterionDetailComponent,
        componentProps: {
          criterion,
        },
      })
      .then((modal) => {
        modal.present()
      })
  }

  answerEvaluation() {
    this.errorMsg = ''
    this.formSubmitted = true

    if (this.answerEvaluationForm.valid) {
      this.toastController
        .create({
          message: 'Not implemented',
          duration: 2000,
          color: 'danger',
        })
        .then((toast) => {
          toast.present()
        })
    } else {
      this.errorMsg = 'Le formulaire est invalide'
    }
  }
}
