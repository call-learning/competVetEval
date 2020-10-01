import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { EvaluationDetailPage } from './evaluation-detail.page'

const routes: Routes = [
  {
    path: ':rotationId/:evaluatorId',
    component: EvaluationDetailPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationDetailPageRoutingModule {}
