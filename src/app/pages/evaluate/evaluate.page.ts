import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ModalController } from '@ionic/angular'

import { ModalEvaluateCriterionComponent } from './../../shared/modals/modal-evaluate-criterion/modal-evaluate-criterion.component'

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.page.html',
  styleUrls: ['./evaluate.page.scss'],
})
export class EvaluatePage implements OnInit {
  evaluation: any

  contextForm: FormGroup
  commentForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {
    this.contextForm = this.formBuilder.group({
      context: ['', [Validators.required]],
    })

    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.evaluation = {
      rotationTitle: 'Rotation chirurgie technique',
      context:
        'Rotation effectuée en hopital vétérinaire sur animaux de companie',
      criteria: [
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
        'Courageux,  autonome, Michelle a fait preuve de tenacité pendant cette rotation.',
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
}
