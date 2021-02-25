import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular'

import { AppraisalService } from '../../core/services/appraisal.service'
import { AuthService } from '../../core/services/auth.service'
import { CriteriaService } from '../../core/services/criteria.service'
import { SituationService } from '../../core/services/situation.service'
import { BaseComponent } from '../../shared/components/base/base.component'
import { ModalAppraisalCriterionComponent } from '../../shared/modals/modal-appraisal-criterion/modal-appraisal-criterion.component'
import { Appraisal } from '../../shared/models/appraisal.model'
import { CriterionAppraisal } from '../../shared/models/criterion-appraisal.model'
import { Criterion } from '../../shared/models/criterion.model'

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.page.html',
  styleUrls: ['./evaluate.page.scss'],
})
export class EvaluatePage extends BaseComponent implements OnInit {
  appraisal: Appraisal
  situationId: number
  studentId: number

  contextForm: FormGroup
  commentForm: FormGroup

  loader: HTMLIonLoadingElement

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router,
    private criteriaService: CriteriaService,
    private situationService: SituationService,
    private appraisalService: AppraisalService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController
  ) {
    super()
    this.contextForm = this.formBuilder.group({
      context: ['', [Validators.required]],
    })

    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    // Create a new evaluation/appraisal.
    // TODO : add a workflow so to enable edition of an existing evaluation.

    this.situationId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('situationId'),
      10
    )
    this.studentId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('studentId'),
      10
    )

    if (this.authService.isAppraiserMode) {
      this.loadingController.create().then((res) => {
        this.loader = res
        this.loader.present()

        this.criteriaService
          .retrieveCriteria()
          .subscribe((criteria: Criterion[]) => {
            this.situationService.situations$.subscribe((situations) => {
              const situation = situations.find(
                (sit) => sit.id === this.situationId
              )
              const transformCriteriaIntoAppraisalCriteria = (
                crit: Criterion
              ) =>
                new CriterionAppraisal({
                  criterionId: crit.id,
                  label: crit.label,
                  comment: '',
                  grade: 0,
                  subcriteria: crit.subcriteria.map(
                    transformCriteriaIntoAppraisalCriteria
                  ),
                })
              const criterionAppraisal = criteria.map(
                transformCriteriaIntoAppraisalCriteria
              )
              this.appraisal = new Appraisal({
                situationId: this.situationId,
                situationTitle: situation.title,
                context: '',
                comment: '',
                appraiserId: this.authService.loggedUser.getValue().userid,
                type: 1,
                studentId: this.studentId,
                timeModified: Date.now(),
                criteria: criterionAppraisal,
              })

              this.loader.dismiss()
            })
          })
      })
    } else {
      this.router.navigate(['/situation-detail', this.situationId])
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
        component: ModalAppraisalCriterionComponent,
        componentProps: {
          criterion,
        },
      })
      .then((modal) => {
        modal.present()
      })
  }

  saveAndRedirect() {
    this.loader.present()
    this.appraisalService
      .submitAppraisal(
        this.appraisal,
        this.authService.loggedUser.getValue().userid,
        this.studentId
      )
      .subscribe(
        () => {
          this.loader.dismiss()
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
        },
        () => {
          this.toastController
            .create({
              message: `Une erreur s'est produite !`,
              duration: 2000,
              color: 'danger',
            })
            .then((toast) => {
              toast.present()
            })
          this.loader.dismiss()
        }
      )
  }

  getSubcriteriaGradedNumber(criterion: CriterionAppraisal) {
    return criterion.subcriteria.filter((sc) => {
      return sc.grade !== 0
    }).length
  }
}
