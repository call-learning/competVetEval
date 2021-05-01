import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { SituationDetailPage } from './situation-detail.page'

const routes: Routes = [
  {
    path: ':evalPlanId/:studentId',
    component: SituationDetailPage,
  },
  {
    path: ':evalPlanId',
    component: SituationDetailPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SituationDetailPageRoutingModule {}
