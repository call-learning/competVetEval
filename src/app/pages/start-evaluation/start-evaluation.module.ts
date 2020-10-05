import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from './../../shared/shared.module'
import { StartEvaluationPageRoutingModule } from './start-evaluation-routing.module'
import { StartEvaluationPage } from './start-evaluation.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartEvaluationPageRoutingModule,
    SharedModule,
  ],
  declarations: [StartEvaluationPage],
})
export class StartEvaluationPageModule {}
