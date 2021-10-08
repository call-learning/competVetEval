import { finalize } from 'rxjs/operators'
/**
 * Appraisal edit page
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular'
import { filter, takeUntil } from 'rxjs/operators'

import { AppraisalUiService } from '../../core/services/appraisal-ui.service'
import { AuthService } from '../../core/services/auth.service'
import { ScheduledSituationService } from '../../core/services/scheduled-situation.service'
import { BaseComponent } from '../../shared/components/base/base.component'
import { ModalAppraisalCriterionComponent } from '../../shared/modals/modal-appraisal-criterion/modal-appraisal-criterion.component'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'
import { CriterionForAppraisalTreeModel } from '../../shared/models/ui/criterion-for-appraisal-tree.model'
import { ScheduledSituation } from '../../shared/models/ui/scheduled-situation.model'

@Component({
  selector: 'app-appraisal-edit',
  templateUrl: './appraisal-edit.page.html',
  styleUrls: ['./appraisal-edit.page.scss'],
})
export class AppraisalEditPage {
  appraisalId: number
  appraisal: AppraisalUI
  scheduledSituation: ScheduledSituation

  contextForm: FormGroup
  commentForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router,
    private scheduledSituationService: ScheduledSituationService,
    private appraisalUIService: AppraisalUiService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController
  ) {
    this.contextForm = this.formBuilder.group({
      context: ['', [Validators.required]],
    })

    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    })
  }

  ionViewWillEnter() {
    // Create a new evaluation/appraisal.
    // TODO : add a workflow so to enable edition of an existing evaluation.

    this.appraisalId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('appraisalId'),
      10
    )

    this.appraisal = null
    this.scheduledSituation = null

    if (this.authService.isAppraiser) {
      this.loadingController.create().then((loader) => {
        loader.present()
        this.appraisalUIService
          .waitForAppraisalId(this.appraisalId)
          .subscribe((appraisal) => {
            this.appraisal = appraisal

            this.scheduledSituationService.situations$.subscribe(
              (situations) => {
                this.scheduledSituation = situations.find(
                  (sit) =>
                    sit.evalPlanId === this.appraisal.evalPlan.id &&
                    sit.studentId === this.appraisal.student.userid
                )
              }
            )
            this.contextForm.setValue({ context: appraisal.context })
            this.commentForm.setValue({ comment: appraisal.comment })
            loader.dismiss()
          })
      })
    } else {
      this.router.navigate(['/situations-list'])
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

    if (grade === null) {
      delete criterion.grade
    } else {
      criterion.grade = grade
    }
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
    this.loadingController.create().then((loader) => {
      loader.present()

      this.appraisal.appraiser = this.authService.loggedUserValue

      this.appraisal.context = this.contextForm.value.context
      this.appraisal.comment = this.commentForm.value.comment

      this.appraisalUIService
        .submitAppraisal(this.appraisal)
        .pipe(
          finalize(() => {
            loader.dismiss()
          })
        )
        .subscribe(
          () => {
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
              'scheduled-situation-detail',
              this.scheduledSituation.evalPlanId,
              this.appraisal.student.userid,
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
          }
        )
    })
  }

  getSubcriteriaGradedNumber(criterion: CriterionForAppraisalTreeModel) {
    return criterion.subcriteria.filter((sc) => {
      return !!sc.grade
    }).length
  }
}
