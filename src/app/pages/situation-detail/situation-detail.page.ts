import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { LoadingController, ModalController } from '@ionic/angular'

import { first } from 'rxjs/operators'
import { AuthService } from 'src/app/core/services/auth.service'
import { ModalAskAppraisalComponent } from 'src/app/shared/modals/modal-ask-appraisal/modal-ask-appraisal.component'
import { ModalSituationChartComponent } from 'src/app/shared/modals/modal-situation-chart/modal-situation-chart.component'
import { Situation } from 'src/app/shared/models/situation.model'
import { AppraisalService } from '../../core/services/appraisal.service'
import { SituationService } from '../../core/services/situation.service'
import { BaseComponent } from '../../shared/components/base/base.component'
import { Appraisal } from './../../shared/models/appraisal.model'

@Component({
  selector: 'app-situation-detail',
  templateUrl: './situation-detail.page.html',
  styleUrls: ['./situation-detail.page.scss'],
})
export class SituationDetailPage extends BaseComponent implements OnInit {
  situationId: number
  studentId: number

  situation: Situation
  appraisals: Appraisal[]

  loader: HTMLIonLoadingElement

  constructor(
    public authService: AuthService,
    private modalController: ModalController,
    public appraisalService: AppraisalService,
    public situationService: SituationService,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController
  ) {
    super()
  }

  ngOnInit() {
    this.situationId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('situationId'),
      10
    )
    if (this.activatedRoute.snapshot.paramMap.has('studentId')) {
      this.studentId = parseInt(
        this.activatedRoute.snapshot.paramMap.get('studentId'),
        10
      )
    } else {
      this.studentId = null
    }

    this.loadingController.create().then((res) => {
      this.loader = res
      this.loader.present()

      this.situationService.situations$
        .pipe(first())
        .subscribe((situations) => {
          this.situation = situations.find((sit) => sit.id === this.situationId)

          const userId = this.studentId
            ? this.studentId
            : this.authService.loggedUser.getValue().userid
          this.appraisalService
            .retrieveAppraisals(userId)
            .subscribe((appraisals) => {
              this.appraisals = []
              appraisals.forEach((appraisal) => {
                if (appraisal.situationId === this.situation.id) {
                  this.appraisals.push(appraisal)
                }
              })
              this.loader.dismiss()
            })
        })
    })
  }

  openModalSituationChart() {
    this.modalController
      .create({
        component: ModalSituationChartComponent,
        componentProps: {
          appraisals: this.appraisals,
        },
      })
      .then((modal) => {
        modal.present()
      })
  }

  openModalAskAppraisal() {
    this.modalController
      .create({
        component: ModalAskAppraisalComponent,
        componentProps: {
          situation: this.situation,
        },
      })
      .then((modal) => {
        modal.present()
      })
  }
}
