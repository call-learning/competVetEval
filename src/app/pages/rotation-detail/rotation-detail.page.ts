import { Component, OnInit } from '@angular/core'

import { ModalController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'
import { ModalAskEvaluationComponent } from 'src/app/shared/modals/modal-ask-evaluation/modal-ask-evaluation.component'
import { ModalRotationChartComponent } from 'src/app/shared/modals/modal-rotation-chart/modal-rotation-chart.component'

@Component({
  selector: 'app-rotation-detail',
  templateUrl: './rotation-detail.page.html',
  styleUrls: ['./rotation-detail.page.scss'],
})
export class RotationDetailPage implements OnInit {
  rotation

  constructor(
    public authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.rotation = {
      title: 'Rotation chirurgie technique',
      subtitle: '10-14 Juillet 2020',
      evaluations: [
        {
          title: 'Philip Payne',
          responsable: true,
          date: '30/09/2020',
          image: 'https://via.placeholder.com/50x50',
        },
        {
          title: 'Philip Payne',
          responsable: false,
          date: '30/09/2020',
          image: 'https://via.placeholder.com/50x50',
        },
        {
          title: 'Philip Payne',
          responsable: false,
          date: '30/09/2020',
          image: 'https://via.placeholder.com/50x50',
        },
      ],
      status: 'done',
      student: {
        image: 'https://via.placeholder.com/50x50',
        name: 'Derrick Simmons',
      },
    }
  }

  openModalRotationChart() {
    this.modalController
      .create({
        component: ModalRotationChartComponent,
        componentProps: {
          rotation: this.rotation,
        },
      })
      .then((modal) => {
        modal.present()
      })
  }

  openModalAskEvaluation() {
    this.modalController
      .create({
        component: ModalAskEvaluationComponent,
        componentProps: {
          rotation: this.rotation,
        },
      })
      .then((modal) => {
        modal.present()
      })
  }
}
