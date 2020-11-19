import { Component, OnInit } from '@angular/core'

import {
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular'

import { filter, takeUntil } from 'rxjs/operators'
import { AuthService } from 'src/app/core/services/auth.service'
import { BaseComponent } from 'src/app/shared/components/base/base.component'
import { ModalScanEvaluationComponent } from './../../shared/modals/modal-scan-evaluation/modal-scan-evaluation.component'

@Component({
  selector: 'app-rotations-list',
  templateUrl: './rotations-list.page.html',
  styleUrls: ['./rotations-list.page.scss'],
})
export class RotationsListPage extends BaseComponent implements OnInit {
  rotations

  constructor(
    private toastController: ToastController,
    private menuController: MenuController,
    public authService: AuthService,
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
        if (mode === 'student') {
          this.rotations = [
            {
              id: 1,
              title: 'Rotation chirurgie technique',
              subtitle: '10-14 Juillet 2020',
              type: 'student',
              evaluated: '3/4',
              comments: '1',
              status: 'done',
            },
            {
              id: 1,
              title: 'Rotation chirurgie technique',
              subtitle: '10-14 Juillet 2020',
              type: 'student',
              evaluated: '3/4',
              comments: '1',
              status: 'in_progress',
            },
            {
              id: 1,
              title: 'Rotation chirurgie technique',
              subtitle: '10-14 Juillet 2020',
              type: 'student',
              evaluated: '3/4',
              comments: '1',
              status: 'todo',
            },
          ]
        } else if (mode === 'evaluator') {
          this.rotations = [
            {
              id: 1,
              title: 'Philip Payne',
              subtitle: 'Rotation chirurgie technique',
              type: 'evaluator',
              status: 'in_progress',
              image: 'https://via.placeholder.com/50x50',
            },
            {
              id: 1,
              title: 'Philip Payne',
              subtitle: 'Rotation chirurgie technique',
              type: 'evaluator',
              status: 'done',
              image: 'https://via.placeholder.com/50x50',
            },
          ]
        }
      })
  }

  openMenu() {
    this.menuController.open('main')
  }

  filterRotations() {
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

  openModalScanEvaluation() {
    this.modalController
      .create({
        component: ModalScanEvaluationComponent,
      })
      .then((modal) => {
        modal.present()
      })
  }
}
