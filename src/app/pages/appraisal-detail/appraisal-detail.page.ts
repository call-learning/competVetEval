import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { LoadingController, ModalController } from '@ionic/angular'

import { filter, takeUntil } from 'rxjs/operators'
import { AuthService } from 'src/app/core/services/auth.service'
import { ModalCriterionDetailComponent } from 'src/app/shared/modals/modal-criterion-detail/modal-criterion-detail.component'
import { AppraisalService } from '../../core/services/appraisal.service'
import { BaseComponent } from '../../shared/components/base/base.component'
import { Appraisal } from '../../shared/models/appraisal.model'

@Component({
  selector: 'app-appraisal-detail',
  templateUrl: './appraisal-detail.page.html',
  styleUrls: ['./appraisal-detail.page.scss'],
})
export class AppraisalDetailPage extends BaseComponent implements OnInit {
  answerAppraisalForm: FormGroup
  errorMsg = ''
  formSubmitted = false

  appraisalId: number
  appraisal: Appraisal

  loader: HTMLIonLoadingElement

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private modalController: ModalController,
    private appraisalService: AppraisalService,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController
  ) {
    super()
    this.answerAppraisalForm = this.formBuilder.group({
      answer: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.appraisalId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('appraisalId'),
      10
    )

    this.loadingController.create().then((res) => {
      this.loader = res
      this.loader.present()

      this.appraisalService
        .retrieveAppraisal(this.appraisalId)
        .subscribe((appraisal) => {
          this.appraisal = appraisal
          this.loader.dismiss()
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
