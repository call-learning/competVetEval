import { Component } from '@angular/core'

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
import { AppraisalUiService } from './../../core/services/appraisal-ui.service'
/**
 * SituationModel List page
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

const DAY_SECONDS = 3600 * 24
const MAX_INTERVAL = 4
@Component({
  selector: 'app-situations-list',
  templateUrl: './situations-list.page.html',
  styleUrls: ['./situations-list.page.scss'],
})
export class SituationsListPage extends BaseComponent {
  situations: ScheduledSituation[]
  situationsDisplayed: ScheduledSituation[]

  situationsStatus: 'today' | 'all' = 'today'

  emptyMessage = ''

  constructor(
    private menuController: MenuController,
    public authService: AuthService,
    public scheduledSituationsService: ScheduledSituationService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private appraisalUIService: AppraisalUiService
  ) {
    super()
  }

  ionViewWillEnter() {
    this.menuController.enable(true)

    this.loadData()
  }

  initComponent() {
    this.situations = null
    this.situationsDisplayed = null
  }

  loadData() {
    this.initComponent()
    this.loadingController.create().then((loader) => {
      loader.present().then(() =>
        this.scheduledSituationsService.situations$.subscribe((situations) => {
          this.situations = situations
          this.filterSituations(this.situationsStatus)
          loader.dismiss()
        })
      )
    })
  }

  ionViewDidLeave(): void {
    this.menuController.enable(false)
  }

  openMenu() {
    this.menuController.open('main')
  }

  segmentChanged(event) {
    this.filterSituations(this.situationsStatus)
  }

  filterSituations(status: 'today' | 'all') {
    if (status === 'today') {
      this.situationsDisplayed = this.filterSituationAroundCurrentTime().sort(
        (sit1, sit2) => sit1.evalPlan.endtime - sit2.evalPlan.endtime
      )
    } else {
      this.situationsDisplayed = this.situations.sort(
        (sit1, sit2) => sit1.evalPlan.starttime - sit2.evalPlan.starttime
      )
    }

    if (!this.situationsDisplayed.length) {
      this.computeEmptyMessage()
    }
  }

  protected filterSituationAroundCurrentTime() {
    const now = new Date()
    let maxts = now.getTime() / 1000 + DAY_SECONDS
    let mints = now.getTime() / 1000 - DAY_SECONDS

    const filterFn = (sit) => {
      const endtimeIn =
        sit.evalPlan.endtime < maxts && sit.evalPlan.endtime > mints
      const startTimeIn =
        sit.evalPlan.starttime < maxts && sit.evalPlan.starttime > mints
      return endtimeIn || startTimeIn
    }
    let filteredSituations = this.situations.filter(filterFn)
    let interval = 3
    while (!filteredSituations?.length) {
      maxts = now.getTime() / 1000 + DAY_SECONDS * interval
      mints = now.getTime() / 1000 - DAY_SECONDS * interval
      filteredSituations = this.situations.filter(filterFn)
      if (interval++ > MAX_INTERVAL) break
    }
    return filteredSituations
  }

  computeEmptyMessage() {
    this.emptyMessage = ''
    if (this.situations.length && !this.situationsDisplayed.length) {
      if (this.authService.isStudent) {
        this.emptyMessage = `Vous n'êtes lié à aucune situation sur cette période.`
      } else {
        this.emptyMessage = `Vous n'avez pas de situations à évaluer sur cette période.`
      }
    } else {
      if (this.authService.isStudent) {
        this.scheduledSituationsService
          .getStudentGroupAssignments(this.authService.loggedUserValue)
          .subscribe((groups) => {
            if (!groups.length) {
              this.emptyMessage = `Vous n'appartenez à aucun groupe d'évaluation.`
            } else {
              this.emptyMessage = `Vous n'êtes lié à aucune situation.`
            }
          })
      } else {
        this.scheduledSituationsService
          .getAppraiserRoles(this.authService.loggedUserValue)
          .subscribe((roles) => {
            if (!roles.length) {
              this.emptyMessage = `Vous n'avez pas de rôle défini.`
            } else {
              this.emptyMessage = `Vous n'avez pas de situations à évaluer.`
            }
          })
      }
    }
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
    this.appraisalUIService
      .refreshAppraisals()
      .pipe(takeUntil(this.alive$))
      .subscribe(() => {
        event.target.complete()
      })
  }
}
