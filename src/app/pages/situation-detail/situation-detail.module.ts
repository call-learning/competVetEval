import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { SituationDetailPageRoutingModule } from './situation-detail-routing.module'
import { SituationDetailPage } from './situation-detail.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SituationDetailPageRoutingModule,
    SharedModule,
  ],
  declarations: [SituationDetailPage],
})
export class SituationDetailPageModule {}
