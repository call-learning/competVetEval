import { SituationsFiltersService } from '../../core/services/situations-filters.service'
import { PopoverSituationsListFiltersComponent } from './../../shared/popovers/popover-situations-list-filters/popover-situations-list-filters.component'
import { Component, OnInit } from '@angular/core'

import {
  LoadingController,
  MenuController,
  ModalController,
  PopoverController,
} from '@ionic/angular'

import { filter, takeUntil, tap } from 'rxjs/operators'
import { AuthService } from 'src/app/core/services/auth.service'
import { BaseComponent } from 'src/app/shared/components/base/base.component'
import { ScheduledSituationService } from '../../core/services/scheduled-situation.service'
import { ModalScanAppraisalComponent } from '../../shared/modals/modal-scan-appraisal/modal-scan-appraisal.component'
import { ScheduledSituation } from '../../shared/models/ui/scheduled-situation.model'
import { AppraisalUiService } from './../../core/services/appraisal-ui.service'
import { SituationsFilters } from 'src/app/core/services/situations-filters.service'
import { BehaviorSubject, combineLatest } from 'rxjs'

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
export class SituationsListPage extends BaseComponent implements OnInit {
  situations: ScheduledSituation[]
  situationsDisplayed: ScheduledSituation[]

  situationsFilters: BehaviorSubject<SituationsFilters>

  emptyMessage = ''

  constructor(
    private menuController: MenuController,
    public authService: AuthService,
    public scheduledSituationsService: ScheduledSituationService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private appraisalUIService: AppraisalUiService,
    private popoverController: PopoverController,
    private situationsFiltersService: SituationsFiltersService
  ) {
    super()
    this.situationsFilters = new BehaviorSubject<SituationsFilters>(null)
  }

  ngOnInit() {
    this.situationsDisplayed = []
    this.situationsFiltersService.situationsFilter$
      .pipe(takeUntil(this.alive$))
      .subscribe((res) => {
        this.situationsFilters.next(res)
      })
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
        combineLatest([
          this.scheduledSituationsService.situations$,
          this.scheduledSituationsService.situationStats$,
          this.situationsFilters,
        ])
          .pipe(
            filter(
              ([situations, stats, filters]) =>
                situations != null && stats != null && filters != null
            ),
            tap(([situations, stats, filters]) => {
              this.situations = situations
              situations.forEach((situation) => {
                if (this.authService.isStudent) {
                  this.scheduledSituationsService
                    .getMyScheduledSituationStats(situation.evalPlan.id)
                    .subscribe((stats) => {
                      situation.stats = stats
                    })
                } else {
                  this.scheduledSituationsService
                    .getAppraiserScheduledSituationStats(
                      situation.evalPlan.id,
                      situation.studentId
                    )
                    .subscribe((stats) => {
                      situation.stats = stats
                    })
                }
              })
              this.filterSituations()
              if (loader.animated) {
                loader.dismiss()
              }
            })
          )
          .subscribe()
      )
    })
  }

  ionViewDidLeave(): void {
    this.menuController.enable(false)
    this.situationsDisplayed = []
  }

  openMenu() {
    this.menuController.open('main')
  }

  filtersChanged(event) {
    if (this.situationsFilters.getValue()) {
      this.situationsFiltersService.situationsFilter$.next(
        this.situationsFilters.getValue()
      )
      this.filterSituations()
    }
  }

  filterSituations() {
    if (this.situations) {
      this.situationsDisplayed = this.situations

      this.filterByTime()
      this.filterByTitle()
      this.filterObservationsNumber()
      this.sortSituations()

      if (!this.situationsDisplayed.length) {
        this.computeEmptyMessage()
      }
    }
  }

  filterByTime() {
    if (this.situationsFilters.getValue().status === 'today') {
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
      let filteredSituations = this.situationsDisplayed.filter(filterFn)
      let interval = 3
      while (!filteredSituations?.length) {
        maxts = now.getTime() / 1000 + DAY_SECONDS * interval
        mints = now.getTime() / 1000 - DAY_SECONDS * interval
        filteredSituations = this.situationsDisplayed.filter(filterFn)
        if (interval++ > MAX_INTERVAL) break
      }
      this.situationsDisplayed = filteredSituations
    }
  }

  filterByTitle() {
    if (this.situationsFilters.getValue().title.length) {
      this.situationsDisplayed = this.situationsDisplayed.filter(
        (situation) => {
          return situation.situation.title
            .toLowerCase()
            .includes(this.situationsFilters.getValue().title.toLowerCase())
        }
      )
    }
  }

  filterObservationsNumber() {
    if (this.situationsFilters.getValue().withoutObservations) {
      this.situationsDisplayed = this.situationsDisplayed.filter(
        (situation) => {
          return situation.stats.appraisalsCompleted === 0
        }
      )
    } else {
      this.situationsDisplayed = this.situationsDisplayed.filter(
        (situation) => {
          return (
            situation.stats.appraisalsCompleted >=
              this.situationsFilters.getValue().observationsNumber.lower &&
            situation.stats.appraisalsCompleted <=
              this.situationsFilters.getValue().observationsNumber.upper
          )
        }
      )
    }
  }

  sortSituations() {
    if (this.situationsFilters.getValue().sortBy === 'startTimeASC') {
      this.situationsDisplayed = this.situationsDisplayed.sort(
        (sit1, sit2) => sit1.evalPlan.starttime - sit2.evalPlan.starttime
      )
    } else if (this.situationsFilters.getValue().sortBy === 'startTimeDESC') {
      this.situationsDisplayed = this.situationsDisplayed.sort(
        (sit1, sit2) => sit2.evalPlan.starttime - sit1.evalPlan.starttime
      )
    } else if (this.situationsFilters.getValue().sortBy === 'endTimeASC') {
      this.situationsDisplayed = this.situationsDisplayed.sort(
        (sit1, sit2) => sit1.evalPlan.endtime - sit2.evalPlan.endtime
      )
    } else if (this.situationsFilters.getValue().sortBy === 'endTimeDESC') {
      this.situationsDisplayed = this.situationsDisplayed.sort(
        (sit1, sit2) => sit2.evalPlan.endtime - sit1.evalPlan.endtime
      )
    } else if (this.situationsFilters.getValue().sortBy === 'observationsASC') {
      this.situationsDisplayed = this.situationsDisplayed.sort(
        (sit1, sit2) =>
          sit1.stats.appraisalsCompleted - sit2.stats.appraisalsCompleted
      )
    } else if (
      this.situationsFilters.getValue().sortBy === 'observationssDESC'
    ) {
      this.situationsDisplayed = this.situationsDisplayed.sort(
        (sit1, sit2) =>
          sit2.stats.appraisalsCompleted - sit1.stats.appraisalsCompleted
      )
    }
  }

  computeEmptyMessage() {
    this.emptyMessage = ''
    if (this.situations.length && !this.situationsDisplayed.length) {
      if (this.authService.isStudent) {
        this.emptyMessage = `Aucune situations ne correspond à ces filtres.`
      } else {
        this.emptyMessage = `Aucune situations à évaluer ne correspond à ces filtres.`
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

  showFilteringOptions(event: any) {
    const popover = this.popoverController
      .create({
        component: PopoverSituationsListFiltersComponent,
        cssClass: 'popover-situations-list-filters',
        translucent: true,
        event,
      })
      .then((popover) => {
        popover.present()
      })

    // const { role } = await popover.onDidDismiss();
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
    this.appraisalUIService.appraisals$.subscribe(() => {
      event.target.complete()
    })
    this.appraisalUIService.forceRefresh()
  }
}
