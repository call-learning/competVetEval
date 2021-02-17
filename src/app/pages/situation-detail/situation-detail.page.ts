import { Component, OnInit } from '@angular/core'

import { ModalController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'
import { ModalAskEvaluationComponent } from 'src/app/shared/modals/modal-ask-evaluation/modal-ask-evaluation.component'
import { ModalSituationChartComponent } from 'src/app/shared/modals/modal-situation-chart/modal-situation-chart.component'

@Component({
  selector: 'app-situation-detail',
  templateUrl: './situation-detail.page.html',
  styleUrls: ['./situation-detail.page.scss'],
})
export class SituationDetailPage implements OnInit {
  situation

  constructor(
    public authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.situation = {
      title: 'Situation chirurgie technique',
      subtitle: '10-14 Juillet 2020',
      evaluations: [
        {
          title: 'Philip Payne',
          responsable: true,
          date: '30/09/2020',
          image: 'https://via.placeholder.com/50x50',
          criteria: [
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
          ],
        },
        {
          title: 'Philip Payne',
          responsable: false,
          date: '30/09/2020',
          image: 'https://via.placeholder.com/50x50',
          criteria: [
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
          ],
        },
        {
          title: 'Philip Payne',
          responsable: false,
          date: '30/09/2020',
          image: 'https://via.placeholder.com/50x50',
          criteria: [
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
            {
              title: 'Savoir être',
              grade: 5,
            },
          ],
        },
      ],
      status: 'done',
      student: {
        image: 'https://via.placeholder.com/50x50',
        name: 'Derrick Simmons',
      },
    }
  }

  openModalSituationChart() {
    this.modalController
      .create({
        component: ModalSituationChartComponent,
        componentProps: {
          situation: this.situation,
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
          situation: this.situation,
        },
      })
      .then((modal) => {
        modal.present()
      })
  }
}
