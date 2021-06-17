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
export class EvaluatePage extends BaseComponent implements OnInit {
  appraisal: AppraisalUI
  evalPlanId: number
  studentId: number

  contextForm: FormGroup
  commentForm: FormGroup

  loader: HTMLIonLoadingElement
  public scheduledSituation: ScheduledSituation = null

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
    // TODO : add a workflow so to enable edition of an existing appraisal.

    this.evalPlanId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('evalPlanId'),
      10
    )
    this.studentId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('studentId'),
      10
    )
    if (this.authService.isAppraiser) {
      this.loadingController.create().then((res) => {
        this.loader = res
        this.loader.present()
        this.situationService.situations$
          .pipe(filter((res) => !!res))
          .subscribe((situations) => {
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
                this.authService.loggedUser.getValue().userid
              )
              .subscribe((appraisalId) => {
                this.appraisalUIService
                  .waitForAppraisalId(appraisalId, true)
                  .pipe(filter((res) => !!res))
                  .subscribe((appraisal) => {
                    this.appraisal = appraisal
                  })
                this.loader.dismiss()
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
    this.appraisal.appraiser = this.authService.loggedUser.getValue()
    // this.appraisal.student = this.userDataService.getUserProfile(this.studentId)
    // See how we can build this without await
    this.appraisalUIService.submitAppraisal(this.appraisal).subscribe(
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
        this.loader.dismiss()
      }
    )
  }

  getSubcriteriaGradedNumber(criterion: CriterionForAppraisalTreeModel) {
    return criterion.subcriteria.filter((sc) => {
      return !!sc.grade
    }).length
  }

  updateContext() {
    this.appraisal.context = this.contextForm.get('context').value
  }

  updateComment() {
    this.appraisal.comment = this.commentForm.get('comment').value
  }
}
