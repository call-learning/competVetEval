import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AngularSvgIconModule } from 'angular-svg-icon'
import { ModalAskEvaluationComponent } from './modals/modal-ask-evaluation/modal-ask-evaluation.component'
import { ModalCriterionDetailComponent } from './modals/modal-criterion-detail/modal-criterion-detail.component'
import { ModalRotationChartComponent } from './modals/modal-rotation-chart/modal-rotation-chart.component'

@NgModule({
  declarations: [
    ModalAskEvaluationComponent,
    ModalCriterionDetailComponent,
    ModalRotationChartComponent,
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
