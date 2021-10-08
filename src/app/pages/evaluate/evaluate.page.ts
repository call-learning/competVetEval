import { concatMap, finalize } from 'rxjs/operators'
/**
 * Evaluate page
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
import { pipe } from 'rxjs'
import { filter } from 'rxjs/operators'

import { AppraisalUiService } from '../../core/services/appraisal-ui.service'
import { AuthService } from '../../core/services/auth.service'
import { ScheduledSituationService } from '../../core/services/scheduled-situation.service'
import { BaseComponent } from '../../shared/components/base/base.component'
import { ModalAppraisalCriterionComponent } from '../../shared/modals/modal-appraisal-criterion/modal-appraisal-criterion.component'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'
import { CriterionForAppraisalTreeModel } from '../../shared/models/ui/criterion-for-appraisal-tree.model'
import { ScheduledSituation } from '../../shared/models/ui/scheduled-situation.model'

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.page.html',
  styleUrls: ['./evaluate.page.scss'],
})
export class EvaluatePage {
  evalPlanId: number
  studentId: number
  appraisal: AppraisalUI
  scheduledSituation: ScheduledSituation = null

  contextForm: FormGroup
  commentForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router,
    private situationService: ScheduledSituationService,
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
    this.contextForm.reset()
    this.commentForm.reset()

    this.evalPlanId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('evalPlanId'),
      10
    )
    this.studentId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('studentId'),
      10
    )

    this.appraisal = null
    this.scheduledSituation = null

    if (this.authService.isAppraiser) {
      this.loadingController.create().then((loader) => {
        loader.present()
        this.situationService.situations$.subscribe((situations) => {
          this.scheduledSituation = situations.find(
            (sit) =>
              sit.evalPlanId === this.evalPlanId &&
              (this.studentId == null || this.studentId === sit.studentId)
          )

          this.appraisalUIService
            .createBlankAppraisal(
              this.scheduledSituation.evalPlanId,
              this.scheduledSituation.situation.evalgridid,
              this.studentId,
              this.authService.loggedUserValue.userid
            )
            .pipe(
              concatMap((appraisalId) => {
                return this.appraisalUIService.waitForAppraisalId(
                  appraisalId,
                  true
                )
              })
            )
            .subscribe((appraisal) => {
              this.appraisal = appraisal
              loader.dismiss()
            })
        })
      })
    } else {
      this.router.navigate(['/scheduled-situation-detail', this.evalPlanId])
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
              '/scheduled-situation-detail',
              this.evalPlanId,
              this.studentId,
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
