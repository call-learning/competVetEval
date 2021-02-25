import { Appraisal } from './../../shared/models/appraisal.model'
import { Situation } from 'src/app/shared/models/situation.model'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { ModalController } from '@ionic/angular'

import { filter, takeUntil } from 'rxjs/operators'
import { AuthService } from 'src/app/core/services/auth.service'
import { ModalAskAppraisalComponent } from 'src/app/shared/modals/modal-ask-appraisal/modal-ask-appraisal.component'
import { ModalSituationChartComponent } from 'src/app/shared/modals/modal-situation-chart/modal-situation-chart.component'
import { AppraisalService } from '../../core/services/appraisal.service'
import { SituationService } from '../../core/services/situation.service'
import { BaseComponent } from '../../shared/components/base/base.component'

@Component({
  selector: 'app-situation-detail',
  templateUrl: './situation-detail.page.html',
  styleUrls: ['./situation-detail.page.scss'],
})
export class SituationDetailPage extends BaseComponent implements OnInit {
  situationId: number
  situation: Situation
  appraisals: Appraisal[]
  studentId: number
  currentMode: 'student' | 'appraiser'

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
    this.appraisals = []

    this.situationService.situations$.subscribe((situations) => {
      this.situation = situations.find((sit) => sit.id === this.situationId)

      this.authService.currentUserRole
        .pipe(
          takeUntil(this.alive$),
          filter((mode) => !!mode)
        )
        .subscribe((mode) => {
          const userId = this.studentId
            ? this.studentId
            : this.authService.loggedUser.getValue().userid
          this.currentMode = mode
          this.appraisalService
            .retrieveAppraisals(userId)
            .subscribe((appraisals) => {
              this.appraisals = []
              appraisals.forEach((appraisal) => {
                if (appraisal.situationId === this.situation.id) {
                  this.appraisals.push(appraisal)
                }
              })
            })
        })
    })
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
