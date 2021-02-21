import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AppraisalDetailPage } from './appraisal-detail.page'

const routes: Routes = [
  {
    path: ':situationId/:appraiserId',
    component: AppraisalDetailPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalDetailPageRoutingModule {}
