import { Component, OnInit } from '@angular/core'

import { ModalController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'
import { ModalAskAppraisalComponent } from 'src/app/shared/modals/modal-ask-appraisal/modal-ask-appraisal.component'
import { ModalSituationChartComponent } from 'src/app/shared/modals/modal-situation-chart/modal-situation-chart.component'
import { filter, takeUntil } from 'rxjs/operators'
import { BaseComponent } from '../../shared/components/base/base.component'
import { AppraisalService } from '../../core/services/appraisal.service'
import { ActivatedRoute } from '@angular/router'
import { SituationService } from '../../core/services/situation.service'

@Component({
  selector: 'app-situation-detail',
  templateUrl: './situation-detail.page.html',
  styleUrls: ['./situation-detail.page.scss'],
})
export class SituationDetailPage extends BaseComponent implements OnInit {
  situationId
  situation
  appraisals

  constructor(
    public authService: AuthService,
    private modalController: ModalController,
    public appraisalService: AppraisalService,
    public situationService: SituationService,
    private activatedRoute: ActivatedRoute
  ) {
    super()
  }

  ngOnInit() {
    this.situationId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('situationId')
    )
    this.appraisals = []
    this.authService.currentUserRole
      .pipe(
        takeUntil(this.alive$),
        filter((mode) => !!mode)
      )
      .subscribe((mode) => {
        this.appraisalService.currentAppraisals.subscribe((appraisals) => {
          this.situation = this.situationService.currentSituations
            .getValue()
            .find((sit) => sit.id === this.situationId)
          this.appraisals = []
          appraisals.forEach((appraisal) => {
            if (appraisal.situationId === this.situation.id) {
              this.appraisals.push(appraisal)
            }
          })
        })
      })
    this.appraisalService.retrieveAppraisals().subscribe()
  }

  openModalSituationChart() {
    this.modalController
      .create({
        component: ModalSituationChartComponent,
        componentProps: {
          situation: this.situation,
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
