import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AngularSvgIconModule } from 'angular-svg-icon'
import { QRCodeModule } from 'angularx-qrcode'
import { AppraiserSituationCardComponent } from './components/appraiser-situation-card/appraiser-situation-card.component'
import { SituationStatusIconComponent } from './components/situation-status-icon/situation-status-icon.component'
import { StudentSituationCardComponent } from './components/student-situation-card/student-situation-card.component'
import { ModalAppraisalCriterionComponent } from './modals/modal-appraisal-criterion/modal-appraisal-criterion.component'
import { ModalAskAppraisalComponent } from './modals/modal-ask-appraisal/modal-ask-appraisal.component'
import { ModalCriterionDetailComponent } from './modals/modal-criterion-detail/modal-criterion-detail.component'
import { ModalScanAppraisalComponent } from './modals/modal-scan-appraisal/modal-scan-appraisal.component'
import { ModalShowAppraisalBarcodeComponent } from './modals/modal-show-appraisal-barcode/modal-show-appraisal-barcode.component'
import { ModalSituationChartComponent } from './modals/modal-situation-chart/modal-situation-chart.component'

@NgModule({
  declarations: [
    ModalAskAppraisalComponent,
    ModalShowAppraisalBarcodeComponent,
    ModalCriterionDetailComponent,
    ModalSituationChartComponent,
    ModalScanAppraisalComponent,
    ModalAppraisalCriterionComponent,
    SituationStatusIconComponent,
    StudentSituationCardComponent,
    AppraiserSituationCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularSvgIconModule,
    ReactiveFormsModule,
    QRCodeModule,
  ],
  exports: [
    AngularSvgIconModule,
    ReactiveFormsModule,
    QRCodeModule,
    SituationStatusIconComponent,
    StudentSituationCardComponent,
    AppraiserSituationCardComponent,
  ],
})
export class SharedModule {}
