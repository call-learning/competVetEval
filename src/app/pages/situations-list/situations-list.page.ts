import { Component, OnInit } from '@angular/core'

import {
  LoadingController,
  MenuController,
  ModalController,
} from '@ionic/angular'

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

  loader: HTMLIonLoadingElement

  constructor(
    private menuController: MenuController,
    public authService: AuthService,
    public situationService: SituationService,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {
    super()
  }

  ngOnInit() {
    this.loadingController.create().then((res) => {
      this.loader = res
      this.loader.present()

      this.situationService.retrieveSituations().subscribe((situations) => {
        this.situations = situations
        this.filterSituations('to_evaluate')
        this.loader.dismiss()
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
      this.situationsDisplayed.sort((sit1, sit2) => sit1.endTime - sit2.endTime)
    } else {
      this.situationsDisplayed = this.situations
      this.situationsDisplayed.sort(
        (sit1, sit2) => sit1.startTime - sit2.startTime
      )
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
