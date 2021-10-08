import { filter, takeUntil } from 'rxjs/operators'
/**
 * Appraisal details page
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { LoadingController, ModalController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'
import { ModalCriterionDetailComponent } from 'src/app/shared/modals/modal-criterion-detail/modal-criterion-detail.component'
import { AppraisalUiService } from '../../core/services/appraisal-ui.service'
import { ScheduledSituationService } from '../../core/services/scheduled-situation.service'
import { BaseComponent } from '../../shared/components/base/base.component'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'
import { CriterionForAppraisalTreeModel } from '../../shared/models/ui/criterion-for-appraisal-tree.model'
import { ScheduledSituation } from '../../shared/models/ui/scheduled-situation.model'

@Component({
  selector: 'app-appraisal-detail',
  templateUrl: './appraisal-detail.page.html',
  styleUrls: ['./appraisal-detail.page.scss'],
})
export class AppraisalDetailPage {
  answerAppraisalForm: FormGroup
  errorMsg = ''
  formSubmitted = false

  appraisalId: number
  appraisal: AppraisalUI
  scheduledSituation: ScheduledSituation

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private modalController: ModalController,
    private appraisalUIService: AppraisalUiService,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController,
    private scheduledSituationService: ScheduledSituationService
  ) {
    this.answerAppraisalForm = this.formBuilder.group({
      answer: ['', [Validators.required]],
    })
  }

  ionViewWillEnter() {
    this.appraisalId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('appraisalId'),
      10
    )

    this.appraisal = null
    this.scheduledSituation = null

    this.loadingController.create().then((loader) => {
      loader.present()

      this.appraisalUIService
        .waitForAppraisalId(this.appraisalId)
        .subscribe((appraisal) => {
          this.appraisal = appraisal

          this.scheduledSituationService.situations$.subscribe((situations) => {
            this.scheduledSituation = situations.find(
              (sit) => sit.evalPlanId === this.appraisal.evalPlan.id
            )
          })

          loader.dismiss()
        })
    })
  }

  getSubcriteriaGradedNumber(criterion: CriterionForAppraisalTreeModel) {
    return criterion.subcriteria.filter((sc) => {
      return !!sc.grade
    }).length
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

  // todo implement
  // answerAppraisal() {
  //   this.errorMsg = ''
  //   this.formSubmitted = true

  //   if (this.answerAppraisalForm.valid) {

  //   } else {
  //     this.errorMsg = 'Le formulaire est invalide'
  //   }
  // }
}
