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

@Component({
  selector: 'app-appraisal-edit',
  templateUrl: './appraisal-edit.page.html',
  styleUrls: ['./appraisal-edit.page.scss'],
})
export class AppraisalEditPage extends BaseComponent implements OnInit {
  appraisal: Appraisal
  appraisalId: number

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

    this.appraisalId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('appraisalId'),
      10
    )

    if (this.authService.isAppraiserMode) {
      this.loadingController.create().then((res) => {
        this.loader = res
        this.loader.present()

        this.appraisalService
          .retrieveAppraisal(this.appraisalId)
          .subscribe((appraisal) => {
            this.appraisal = appraisal
            this.contextForm.setValue({ context: appraisal.context })
            this.commentForm.setValue({ comment: appraisal.comment })
            this.loader.dismiss()
          })
      })
    } else {
      this.router.navigate(['/situation-list'])
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
    this.appraisal.appraiserId = this.authService.loggedUser.getValue().userid
    this.appraisalService.submitAppraisal(this.appraisal).subscribe(
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
        this.router.navigate([
          'situation-detail',
          this.appraisal.situationId,
          this.appraisal.studentId,
        ])
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

  updateContext() {
    this.appraisal.context = this.contextForm.get('context').value
  }

  updateComment() {
    this.appraisal.context = this.commentForm.get('comment').value
  }
}
