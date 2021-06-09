/**
 * SituationModel List page
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Component, OnInit } from '@angular/core'

import {
  LoadingController,
  MenuController,
  ModalController,
} from '@ionic/angular'

import { takeUntil } from 'rxjs/operators'
import { AuthService } from 'src/app/core/services/auth.service'
import { BaseComponent } from 'src/app/shared/components/base/base.component'
import { ScheduledSituationService } from '../../core/services/scheduled-situation.service'
import { ModalScanAppraisalComponent } from '../../shared/modals/modal-scan-appraisal/modal-scan-appraisal.component'
import { ScheduledSituation } from '../../shared/models/ui/scheduled-situation.model'

const DAY_SECONDS = 3600 * 24
const MAX_INTERVAL = 8
@Component({
  selector: 'app-situations-list',
  templateUrl: './situations-list.page.html',
  styleUrls: ['./situations-list.page.scss'],
})
export class SituationsListPage extends BaseComponent implements OnInit {
  situations: ScheduledSituation[]
  situationsDisplayed: ScheduledSituation[]

  loader: HTMLIonLoadingElement

  constructor(
    private menuController: MenuController,
    public authService: AuthService,
    public scheduledSituationsService: ScheduledSituationService,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {
    super()
  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.loadingController.create().then((res) => {
      this.loader = res
      this.loader.present().then(() =>
        this.scheduledSituationsService.situations$
          .pipe(takeUntil(this.alive$))
          .subscribe((situations) => {
            const scheduledSituations = situations
            if (scheduledSituations) {
              // console.log('Situations: ' + JSON.stringify(scheduledSituations))
              this.situations = scheduledSituations
              this.filterSituations('all')
            }
            if (this.loader.animated) {
              this.loader.dismiss()
            }
          })
      )
    })
  }

  ionViewDidEnter(): void {
    this.menuController.enable(true)
  }

  ionViewDidLeave(): void {
    this.menuController.enable(false)
  }

  openMenu() {
    this.menuController.open('main')
  }

  segmentChanged(event) {
    this.filterSituations(event.detail.value)
  }

  filterSituations(status: 'today' | 'all') {
    this.situationsDisplayed = this.situations
    if (status === 'today') {
      this.situationsDisplayed = this.filterSituationAroundCurrentTime()
      this.situationsDisplayed.sort(
        (sit1, sit2) => sit1.evalPlan.endtime - sit2.evalPlan.endtime
      )
    } else {
      this.situationsDisplayed.sort(
        (sit1, sit2) => sit1.evalPlan.starttime - sit2.evalPlan.starttime
      )
    }
  }

  protected filterSituationAroundCurrentTime() {
    let filteredSituations = []
    const now = new Date()
    let maxts = now.getTime() / 1000 + DAY_SECONDS
    let mints = now.getTime() / 1000 - DAY_SECONDS
    const filter = (sit) => {
      const endtimeIn =
        sit.evalPlan.endtime < maxts && sit.evalPlan.endtime > mints
      const startTimeIn =
        sit.evalPlan.starttime < maxts && sit.evalPlan.starttime > mints
      return endtimeIn || startTimeIn
    }
    filteredSituations = this.situations.filter(filter)
    let interval = 3
    while (!filteredSituations?.length) {
      maxts = now.getTime() / 1000 + DAY_SECONDS * interval
      mints = now.getTime() / 1000 - DAY_SECONDS * interval
      filteredSituations = this.situations.filter(filter)
      if (interval++ > MAX_INTERVAL) break
    }
    return filteredSituations
  }

  openModalScanAppraisal() {
    this.modalController
      .create({
        component: ModalScanAppraisalComponent,
      })
      .then((modal) => {
        modal.present()
      })
  }

  doRefresh(event) {
    this.scheduledSituationsService
      .refreshStats()
      .subscribe((allsituations) => {
        event.target.complete()
      })
  }
}
