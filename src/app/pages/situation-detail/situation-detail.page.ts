import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { LoadingController, ModalController } from '@ionic/angular'
import { take } from 'lodash'

import { forkJoin, zip } from 'rxjs'
import { filter, first, map, takeUntil } from 'rxjs/operators'
import { AuthService } from 'src/app/core/services/auth.service'
import { ModalAskAppraisalComponent } from 'src/app/shared/modals/modal-ask-appraisal/modal-ask-appraisal.component'
import { ModalSituationChartComponent } from 'src/app/shared/modals/modal-situation-chart/modal-situation-chart.component'
import { ScheduledSituation } from 'src/app/shared/models/ui/scheduled-situation.model'
import { AppraisalUiService } from '../../core/services/appraisal-ui.service'
import { ScheduledSituationService } from '../../core/services/scheduled-situation.service'
import { UserDataService } from '../../core/services/user-data.service'
import { BaseComponent } from '../../shared/components/base/base.component'
import { ShowAppraisalBarcodeComponent } from '../../shared/modals/show-appraisal-barcode/show-appraisal-barcode.component'
import { CevUser } from '../../shared/models/cev-user.model'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'

@Component({
  selector: 'app-situation-detail',
  templateUrl: './situation-detail.page.html',
  styleUrls: ['./situation-detail.page.scss'],
})
export class SituationDetailPage extends BaseComponent {
  evalPlanId: number = null
  studentId: number = null
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
    private loadingController: LoadingController,
    private router: Router
  ) {
    super()
  }

  ionViewWillEnter() {
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

    this.initAppraisals()
    this.getSituation()
  }

  initAppraisals() {
    this.appraisals = null
    // Refresh when we change the appraisals.
    this.appraisalUIService
      .fetchAppraisalsForEvalPlanStudentId(this.evalPlanId, this.studentId)
      .pipe(takeUntil(this.alive$))
      .subscribe((appraisals) => {
        this.appraisals = appraisals
      })
  }

  getSituation() {
    this.scheduledSituation = null

    this.loadingController.create().then((res) => {
      this.loader = res
      this.loader.present()

      forkJoin([
        this.situationService.situations$.pipe(
          filter((sit) => !!sit),
          first()
        ),
        this.userDataService.getUserProfileInfo(this.studentId),
      ])
        .pipe(
          map(([situations, userProfile]) => {
            if (situations) {
              this.scheduledSituation = situations.find(
                (s) =>
                  s.evalPlanId === this.evalPlanId &&
                  (this.studentId == null || this.studentId === s.studentId)
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
    const criteriaLabels = this.appraisals
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

  showPendingAppraisal(appraisalId) {
    if (this.authService.isStudent) {
      this.modalController
        .create({
          component: ShowAppraisalBarcodeComponent,
          componentProps: {
            appraisalId,
          },
        })
        .then((modal) => {
          modal.present()
        })
    } else {
      this.loader.present()
      this.appraisalUIService
        .waitForAppraisalId(appraisalId)
        .subscribe((appraisal: AppraisalUI) => {
          appraisal.appraiser = this.authService.loggedUserValue
          if (this.loader.animated) {
            this.loader.dismiss()
          }
          this.appraisalUIService
            .submitAppraisal(appraisal)
            .subscribe((thisAppraisalId) => {
              this.router.navigate(['appraisal-edit', thisAppraisalId])
            })
        })
    }
  }

  /**
   * Refresh situation
   *
   * @param event
   */
  doRefresh(event) {
    this.appraisalUIService.refreshAppraisals().subscribe(() => {
      event.target.complete()
    })
  }
}
