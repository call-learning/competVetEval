import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CriterionDetailPage } from './criterion-detail.page'

const routes: Routes = [
  {
    path: ':rotationId/:evaluatorId/:criterionId',
    component: CriterionDetailPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriterionDetailPageRoutingModule {}
