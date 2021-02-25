import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AngularSvgIconModule } from 'angular-svg-icon'
import { QRCodeModule } from 'angularx-qrcode'
import { ModalEvaluateCriterionComponent } from './modals/modal-appraisal-criterion/modal-evaluate-criterion.component'
import { ModalAskAppraisalComponent } from './modals/modal-ask-appraisal/modal-ask-appraisal.component'
import { ModalCriterionDetailComponent } from './modals/modal-criterion-detail/modal-criterion-detail.component'
import { ModalScanAppraisalComponent } from './modals/modal-scan-appraisal/modal-scan-appraisal.component'
import { ModalSituationChartComponent } from './modals/modal-situation-chart/modal-situation-chart.component'

@NgModule({
  declarations: [
    ModalAskAppraisalComponent,
    ModalCriterionDetailComponent,
    ModalSituationChartComponent,
    ModalScanAppraisalComponent,
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
