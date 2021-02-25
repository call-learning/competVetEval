import { Component, OnInit } from '@angular/core'

import {
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular'

import { filter, takeUntil } from 'rxjs/operators'
import { AuthService } from 'src/app/core/services/auth.service'
import { BaseComponent } from 'src/app/shared/components/base/base.component'
import { Situation } from 'src/app/shared/models/situation.model'
import { SituationService } from '../../core/services/situation.service'
import { ModalScanAppraisalComponent } from './../../shared/modals/modal-scan-appraisal/modal-scan-appraisal.component'

@Component({
  selector: 'app-situations-list',
  templateUrl: './situations-list.page.html',
  styleUrls: ['./situations-list.page.scss'],
})
export class SituationsListPage extends BaseComponent implements OnInit {
  situations: Situation[]
  situationsDisplayed: Situation[]

  constructor(
    private menuController: MenuController,
    public authService: AuthService,
    public situationService: SituationService,
    private modalController: ModalController
  ) {
    super()
  }

  ngOnInit() {
    this.authService.currentUserRole
      .pipe(
        takeUntil(this.alive$),
        filter((mode) => !!mode)
      )
      .subscribe((mode) => {
        this.situationService.retrieveSituations().subscribe((situations) => {
          this.situations = situations
          this.filterSituations('to_evaluate')
        })
      })
  }

  openMenu() {
    this.menuController.open('main')
  }

  segmentChanged(event) {
    this.filterSituations(event.detail.value)
  }

  filterSituations(status: 'to_evaluate' | 'all') {
    if (status === 'to_evaluate') {
      this.situationsDisplayed = this.situations.filter((situation) => {
        return situation.status !== 'done'
      })
    } else {
      this.situationsDisplayed = this.situations
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
}
