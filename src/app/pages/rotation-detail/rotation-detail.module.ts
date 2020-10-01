import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { RotationDetailPageRoutingModule } from './rotation-detail-routing.module'
import { RotationDetailPage } from './rotation-detail.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RotationDetailPageRoutingModule,
    SharedModule,
  ],
  declarations: [RotationDetailPage],
})
export class RotationDetailPageModule {}
