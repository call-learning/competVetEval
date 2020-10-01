import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { RotationStatsPageRoutingModule } from './rotation-stats-routing.module'
import { RotationStatsPage } from './rotation-stats.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RotationStatsPageRoutingModule,
    SharedModule,
  ],
  declarations: [RotationStatsPage],
})
export class RotationStatsPageModule {}
