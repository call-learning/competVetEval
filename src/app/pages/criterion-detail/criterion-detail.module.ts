import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { CriterionDetailPageRoutingModule } from './criterion-detail-routing.module'
import { CriterionDetailPage } from './criterion-detail.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CriterionDetailPageRoutingModule,
  ],
  declarations: [CriterionDetailPage],
})
export class CriterionDetailPageModule {}
