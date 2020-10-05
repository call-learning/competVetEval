import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from './../../shared/shared.module'
import { PreciseCriterionPageRoutingModule } from './precise-criterion-routing.module'
import { PreciseCriterionPage } from './precise-criterion.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreciseCriterionPageRoutingModule,
    SharedModule,
  ],
  declarations: [PreciseCriterionPage],
})
export class PreciseCriterionPageModule {}
