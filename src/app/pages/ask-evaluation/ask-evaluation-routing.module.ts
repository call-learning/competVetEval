import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AskEvaluationPage } from './ask-evaluation.page'

const routes: Routes = [
  {
    path: ':rotationId',
    component: AskEvaluationPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AskEvaluationPageRoutingModule {}
