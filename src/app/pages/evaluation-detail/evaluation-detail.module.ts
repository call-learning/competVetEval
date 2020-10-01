import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { EvaluationDetailPageRoutingModule } from './evaluation-detail-routing.module'
import { EvaluationDetailPage } from './evaluation-detail.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluationDetailPageRoutingModule,
    SharedModule,
  ],
  declarations: [EvaluationDetailPage],
})
export class EvaluationDetailPageModule {}
