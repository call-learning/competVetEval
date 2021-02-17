import { Component, Input, OnInit } from '@angular/core'

import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-modal-situation-chart',
  templateUrl: './modal-situation-chart.component.html',
  styleUrls: ['./modal-situation-chart.component.scss'],
})
export class ModalSituationChartComponent implements OnInit {
  @Input() situation: any

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }
}
