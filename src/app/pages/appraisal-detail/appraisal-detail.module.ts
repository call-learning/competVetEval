import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { AppraisalDetailPageRoutingModule } from './appraisal-detail-routing.module'
import { AppraisalDetailPage } from './appraisal-detail.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppraisalDetailPageRoutingModule,
    SharedModule,
  ],
  declarations: [AppraisalDetailPage],
})
export class AppraisalDetailPageModule {}
