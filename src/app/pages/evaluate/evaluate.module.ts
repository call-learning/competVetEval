import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { EvaluatePageRoutingModule } from './evaluate-routing.module'
import { EvaluatePage } from './evaluate.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluatePageRoutingModule,
    SharedModule,
  ],
  declarations: [EvaluatePage],
})
export class EvaluatePageModule {}
