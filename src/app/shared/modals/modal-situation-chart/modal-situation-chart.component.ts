import { Component, Input, OnInit } from '@angular/core'

import { ModalController } from '@ionic/angular'

import { Appraisal } from '../../models/appraisal.model'

@Component({
  selector: 'app-modal-situation-chart',
  templateUrl: './modal-situation-chart.component.html',
  styleUrls: ['./modal-situation-chart.component.scss'],
})
export class ModalSituationChartComponent implements OnInit {
  @Input() appraisals: Appraisal[]

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }
}
