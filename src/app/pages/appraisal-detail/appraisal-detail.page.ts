import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ModalController, ToastController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'
import { ModalCriterionDetailComponent } from 'src/app/shared/modals/modal-criterion-detail/modal-criterion-detail.component'
import { Appraisal } from '../../shared/models/appraisal.model'
import { filter, takeUntil } from 'rxjs/operators'
import { AppraisalService } from '../../core/services/appraisal.service'
import { ActivatedRoute } from '@angular/router'
import { BaseComponent } from '../../shared/components/base/base.component'

@Component({
  selector: 'app-appraisal-detail',
  templateUrl: './appraisal-detail.page.html',
  styleUrls: ['./appraisal-detail.page.scss'],
})
export class AppraisalDetailPage extends BaseComponent implements OnInit {
  answerAppraisalForm: FormGroup

  errorMsg = ''

  formSubmitted = false

  appraisalId
  appraisal: Appraisal

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    public authService: AuthService,
    private modalController: ModalController,
    private appraisalService: AppraisalService,
    private activatedRoute: ActivatedRoute
  ) {
    super()
    this.answerAppraisalForm = this.formBuilder.group({
      answer: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.appraisalId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('appraisalId')
    )
    this.authService.currentUserRole
      .pipe(
        takeUntil(this.alive$),
        filter((mode) => !!mode)
      )
      .subscribe((mode) => {
        this.appraisalService
          .retrieveAppraisal(this.appraisalId)
          .subscribe((appraisal) => {
            this.appraisal = appraisal
          })
      })
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

  answerAppraisal() {
    this.errorMsg = ''
    this.formSubmitted = true

    if (this.answerAppraisalForm.valid) {
      this.toastController
        .create({
          message: 'Not implemented',
          duration: 2000,
          color: 'danger',
        })
        .then((toast) => {
          toast.present()
        })
    } else {
      this.errorMsg = 'Le formulaire est invalide'
    }
  }
}
