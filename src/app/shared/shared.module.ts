import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AngularSvgIconModule } from 'angular-svg-icon'
import { ModalAskEvaluationComponent } from './modals/modal-ask-evaluation/modal-ask-evaluation.component'
import { ModalCriterionDetailComponent } from './modals/modal-criterion-detail/modal-criterion-detail.component'
import { ModalEvaluateCriterionComponent } from './modals/modal-evaluate-criterion/modal-evaluate-criterion.component'
import { ModalRotationChartComponent } from './modals/modal-rotation-chart/modal-rotation-chart.component'
import { ModalScanEvaluationComponent } from './modals/modal-scan-evaluation/modal-scan-evaluation.component'

@NgModule({
  declarations: [
    ModalAskEvaluationComponent,
    ModalCriterionDetailComponent,
    ModalRotationChartComponent,
    ModalScanEvaluationComponent,
    ModalEvaluateCriterionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularSvgIconModule,
    ReactiveFormsModule,
  ],
  exports: [AngularSvgIconModule, ReactiveFormsModule],
})
export class SharedModule {}
