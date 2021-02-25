import { Component, OnInit } from '@angular/core'

import {
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular'

import { filter, takeUntil } from 'rxjs/operators'
import { AuthService } from 'src/app/core/services/auth.service'
import { BaseComponent } from 'src/app/shared/components/base/base.component'
import { SituationService } from '../../core/services/situation.service'
import { ModalScanAppraisalComponent } from './../../shared/modals/modal-scan-appraisal/modal-scan-appraisal.component'

@Component({
  selector: 'app-situations-list',
  templateUrl: './situations-list.page.html',
  styleUrls: ['./situations-list.page.scss'],
})
export class SituationsListPage extends BaseComponent implements OnInit {
  situations

  constructor(
    private toastController: ToastController,
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
        // console.log('current user type', mode)
        this.situationService.retrieveSituations().subscribe((situations) => {
          // console.log('situations list', situations);
          this.situations = situations
        })
      })
  }

  openMenu() {
    this.menuController.open('main')
  }

  filterSituations() {
    this.toastController
      .create({
        message: 'Not implemented',
        duration: 2000,
        color: 'danger',
      })
      .then((toast) => {
        toast.present()
      })
  }

  segmentChanged(event) {
    this.toastController
      .create({
        message: 'Not implemented',
        duration: 2000,
        color: 'danger',
      })
      .then((toast) => {
        toast.present()
      })
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
