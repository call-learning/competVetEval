import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { PreciseCriterionPage } from './precise-criterion.page'

const routes: Routes = [
  {
    path: ':rotationId/:criterionId',
    component: PreciseCriterionPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreciseCriterionPageRoutingModule {}
