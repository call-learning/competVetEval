import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { CreateEvaluationPageRoutingModule } from './create-evaluation-routing.module'
import { CreateEvaluationPage } from './create-evaluation.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateEvaluationPageRoutingModule,
  ],
  declarations: [CreateEvaluationPage],
})
export class CreateEvaluationPageModule {}
