/**
 * Ask appraisal components
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { IonTextarea, ModalController } from '@ionic/angular'

import { AppraisalUiService } from '../../../core/services/appraisal-ui.service'
import { AuthService } from '../../../core/services/auth.service'
import { ScheduledSituation } from './../../models/ui/scheduled-situation.model'

@Component({
  selector: 'app-modal-ask-appraisal',
  templateUrl: './modal-ask-appraisal.component.html',
  styleUrls: ['./modal-ask-appraisal.component.scss'],
})
export class ModalAskAppraisalComponent implements AfterViewInit {
  @Input() scheduledSituation: ScheduledSituation

  qrCodeData: string

  askAppraisalForm: FormGroup

  errorMsg = ''

  formSubmitted = false

  step: 'context' | 'qr-code' = 'context'

  @ViewChild('contextInput') contextInput: IonTextarea

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private appraisalService: AppraisalUiService,
    private authService: AuthService
  ) {
    this.askAppraisalForm = this.formBuilder.group({
      context: ['', [Validators.required]],
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.contextInput.setFocus()
    }, 500)
  }

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }

  nextStep() {
    this.errorMsg = ''
    this.formSubmitted = true

    if (this.askAppraisalForm.valid && this.step !== 'qr-code') {
      this.appraisalService
        .createBlankAppraisal(
          this.scheduledSituation.evalPlanId,
          this.scheduledSituation.situation.evalgridid,
          this.authService.loggedUserValue.userid,
          0, // For now we don't know the appraiser.
          '',
          this.contextInput.value
        )
        .subscribe((appraisaluiId) => {
          this.step = 'qr-code'
          this.qrCodeData = `${appraisaluiId}`
        })
    } else {
      this.errorMsg = 'Le formulaire est invalide'
    }
  }

  previousStep() {
    this.step = 'context'
  }
}
