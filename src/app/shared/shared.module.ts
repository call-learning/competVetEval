import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AngularSvgIconModule } from 'angular-svg-icon'
import { QRCodeModule } from 'angularx-qrcode'
import { ModalAskEvaluationComponent } from './modals/modal-ask-evaluation/modal-ask-evaluation.component'
import { ModalCriterionDetailComponent } from './modals/modal-criterion-detail/modal-criterion-detail.component'
import { ModalEvaluateCriterionComponent } from './modals/modal-evaluate-criterion/modal-evaluate-criterion.component'
import { ModalSituationChartComponent } from './modals/modal-situation-chart/modal-situation-chart.component'
import { ModalScanEvaluationComponent } from './modals/modal-scan-evaluation/modal-scan-evaluation.component'

@NgModule({
  declarations: [
    ModalAskEvaluationComponent,
    ModalCriterionDetailComponent,
    ModalSituationChartComponent,
    ModalScanEvaluationComponent,
    ModalEvaluateCriterionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularSvgIconModule,
    ReactiveFormsModule,
    QRCodeModule,
  ],
  exports: [AngularSvgIconModule, ReactiveFormsModule, QRCodeModule],
})
export class SharedModule {}
