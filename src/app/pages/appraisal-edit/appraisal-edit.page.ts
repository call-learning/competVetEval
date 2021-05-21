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

import { AuthService } from '../../core/services/auth.service'
import { ScheduledSituationService } from '../../core/services/scheduled-situation.service'
import { BaseComponent } from '../../shared/components/base/base.component'
import { ModalAppraisalCriterionComponent } from '../../shared/modals/modal-appraisal-criterion/modal-appraisal-criterion.component'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'
import { CriterionForAppraisalTreeModel } from '../../shared/models/ui/criterion-for-appraisal-tree.model'
import { AppraisalUiService } from '../../core/services/appraisal-ui.service'
import { ScheduledSituation } from '../../shared/models/ui/scheduled-situation.model'

@Component({
  selector: 'app-appraisal-edit',
  templateUrl: './appraisal-edit.page.html',
  styleUrls: ['./appraisal-edit.page.scss'],
})
export class AppraisalEditPage extends BaseComponent implements OnInit {
  appraisal: AppraisalUI
  appraisalId: number
  scheduledSituation: ScheduledSituation = null
  contextForm: FormGroup
  commentForm: FormGroup

  loader: HTMLIonLoadingElement

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

    if (this.authService.isAppraiser) {
      this.loadingController.create().then((res) => {
        this.loader = res
        this.loader.present()
        this.appraisalUIService
          .waitForAppraisalId(this.appraisalId)
          .subscribe((appraisal) => {
            this.appraisal = appraisal
            this.scheduledSituationService.situations$.subscribe(
              (situations) => {
                this.scheduledSituation = situations.find(
                  (sit) => sit.evalPlanId == this.appraisal.evalPlan.id
                )
              }
            )
            this.contextForm.setValue({ context: appraisal.context })
            this.commentForm.setValue({ comment: appraisal.comment })
            this.loader.dismiss()
          })
      })
    } else {
      this.router.navigate(['/scheduledSituation-list'])
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
        this.loader.dismiss()
      }
    )
  }

  getSubcriteriaGradedNumber(criterion: CriterionForAppraisalTreeModel) {
    return criterion.subcriteria.filter((sc) => {
      return sc.grade !== 0
    }).length
  }

  updateContext() {
    this.appraisal.context = this.contextForm.get('context').value
  }

  updateComment() {
    this.appraisal.comment = this.commentForm.get('comment').value
  }
}
