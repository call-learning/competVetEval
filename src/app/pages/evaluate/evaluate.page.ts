import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { ModalController, ToastController } from '@ionic/angular'

import { ModalEvaluateCriterionComponent } from '../../shared/modals/modal-appraisal-criterion/modal-evaluate-criterion.component'
import { AppraisalService } from '../../core/services/appraisal.service'
import { AuthService } from '../../core/services/auth.service'

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.page.html',
  styleUrls: ['./evaluate.page.scss'],
})
export class EvaluatePage implements OnInit {
  appraisal: any

  contextForm: FormGroup
  commentForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router,
    private appraisalService: AppraisalService,
    public authService: AuthService
  ) {
    this.contextForm = this.formBuilder.group({
      context: ['', [Validators.required]],
    })

    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.appraisal = {
      situationTitle: 'Situation chirurgie technique',
      context:
        'Situation effectuée en hopital vétérinaire sur animaux de companie',
      criteria: [
        {
          id: 1,
          title: 'Savoir être, qualités personnelles et professionnelles',
          evaluated: '3/4',
          comments: '1',
          grade: null,
          subcriteria: [
            {
              id: 15,
              title: 'Ponctualité',
              grade: null,
            },
            {
              title: 'Ponctualité',
              grade: null,
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
              grade: null,
            },
            {
              title: 'Ponctualité',
              grade: null,
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
              grade: null,
            },
            {
              title: 'Ponctualité',
              grade: null,
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
              grade: null,
            },
            {
              title: 'Ponctualité',
              grade: null,
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
              grade: null,
            },
            {
              title: 'Ponctualité',
              grade: null,
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
              grade: null,
            },
            {
              title: 'Ponctualité',
              grade: null,
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

  evaluateCriterion(criterion, event: Event) {
    event.stopPropagation()
    criterion.evaluating = true
  }

  dismissEvaluateCriterion(criterion, event: Event) {
    if (event) {
      event.stopPropagation()
    }

    criterion.evaluating = false
  }

  selectGrade(criterion, grade, event) {
    event.stopPropagation()
    criterion.grade = grade
    this.dismissEvaluateCriterion(criterion, null)
  }

  openModalEvaluateCriterion(criterion) {
    this.modalController
      .create({
        component: ModalEvaluateCriterionComponent,
        componentProps: {
          criterion,
        },
      })
      .then((modal) => {
        modal.present()
      })
  }

  saveAndRedirect() {
    this.appraisalService
      .submitAppraisal(
        this.appraisal,
        this.authService.loggedUser.getValue().userid
      )
      .subscribe(() => {
        this.toastController
          .create({
            message: 'Enregistré !',
            duration: 2000,
            color: 'success',
          })
          .then((toast) => {
            toast.present()
          })
        this.router.navigate(['situations-list'])
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
