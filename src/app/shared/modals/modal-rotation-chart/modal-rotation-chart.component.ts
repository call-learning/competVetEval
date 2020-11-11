import { Component, Input, OnInit } from '@angular/core'

import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-modal-rotation-chart',
  templateUrl: './modal-rotation-chart.component.html',
  styleUrls: ['./modal-rotation-chart.component.scss'],
})
export class ModalRotationChartComponent implements OnInit {
  @Input() rotation: any

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }
}
