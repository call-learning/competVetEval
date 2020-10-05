import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { StartEvaluationPage } from './start-evaluation.page'

const routes: Routes = [
  {
    path: ':rotationId',
    component: StartEvaluationPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartEvaluationPageRoutingModule {}
