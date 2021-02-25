import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { SituationDetailPage } from './situation-detail.page'

const routes: Routes = [
  {
    path: ':situationId/:studentId',
    component: SituationDetailPage,
  },
  {
    path: ':situationId',
    component: SituationDetailPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SituationDetailPageRoutingModule {}
