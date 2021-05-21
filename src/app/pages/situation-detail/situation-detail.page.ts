import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { LoadingController, ModalController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'
import { ModalAskAppraisalComponent } from 'src/app/shared/modals/modal-ask-appraisal/modal-ask-appraisal.component'
import { ModalSituationChartComponent } from 'src/app/shared/modals/modal-situation-chart/modal-situation-chart.component'
import { ScheduledSituation } from 'src/app/shared/models/ui/scheduled-situation.model'
import { ScheduledSituationService } from '../../core/services/scheduled-situation.service'
import { BaseComponent } from '../../shared/components/base/base.component'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'
import { BehaviorSubject, combineLatest, iif, of, zip } from 'rxjs'
import { UserDataService } from '../../core/services/user-data.service'
import { CevUser } from '../../shared/models/cev-user.model'
import { AppraisalUiService } from '../../core/services/appraisal-ui.service'
import { combineAll, map, zipAll } from 'rxjs/operators'

@Component({
  selector: 'app-situation-detail',
  templateUrl: './situation-detail.page.html',
  styleUrls: ['./situation-detail.page.scss'],
})
export class SituationDetailPage extends BaseComponent implements OnInit {
  evalPlanId: number = null
  studentId: number = null
  currentUserId: number = null
  studentInfo: CevUser = null

  scheduledSituation: ScheduledSituation
  appraisals = null

  loader: HTMLIonLoadingElement

  constructor(
    public authService: AuthService,
    private modalController: ModalController,
    public appraisalUIService: AppraisalUiService,
    public situationService: ScheduledSituationService,
    private activatedRoute: ActivatedRoute,
    private userDataService: UserDataService,
    private loadingController: LoadingController
  ) {
    super()
  }

  ngOnInit() {
    this.evalPlanId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('evalPlanId'),
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

    this.currentUserId = this.authService.loggedUser.getValue().userid
    // Refresh when we change the appraisals.
    this.appraisalUIService
      .fetchAppraisalsForEvalPlanStudentId(this.evalPlanId, this.studentId)
      .subscribe((appraisals) => {
        this.appraisals = appraisals
      })
    this.loadingController.create().then((res) => {
      this.loader = res
      this.loader.present()
      zip(
        this.situationService.situations$.asObservable(),
        iif(
          () => this.studentId != null,
          this.userDataService.getUserProfileInfo(this.studentId),
          of(null)
        )
      )
        .pipe(
          map(([situations, userProfile]) => {
            if (situations) {
              this.scheduledSituation = situations.find(
                (s) =>
                  s.evalPlanId == this.evalPlanId &&
                  (this.studentId == null || this.studentId == s.studentId)
              )
              if (userProfile) {
                this.studentInfo = userProfile
              }
              if (this.loader.animated) {
                this.loader.dismiss()
              }
            }
          })
        )
        .subscribe()
    })
  }

  openModalSituationChart() {
    let criteriaLabels = this.appraisals
      ? this.appraisals[0].criteria.map((c) => c.label)
      : []
    this.modalController
      .create({
        component: ModalSituationChartComponent,
        componentProps: {
          appraisals: this.appraisals,
          labels: criteriaLabels,
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
          scheduledSituation: this.scheduledSituation,
          studentId: this.studentId,
        },
      })
      .then((modal) => {
        modal.present()
      })
  }
}
