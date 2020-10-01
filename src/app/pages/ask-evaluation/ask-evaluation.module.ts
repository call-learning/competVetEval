import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { AskEvaluationPageRoutingModule } from './ask-evaluation-routing.module'
import { AskEvaluationPage } from './ask-evaluation.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AskEvaluationPageRoutingModule,
    SharedModule,
  ],
  declarations: [AskEvaluationPage],
})
export class AskEvaluationPageModule {}
