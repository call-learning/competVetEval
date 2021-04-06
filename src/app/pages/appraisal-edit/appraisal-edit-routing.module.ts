import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AppraisalEditPage } from './appraisal-edit.page'

const routes: Routes = [
  {
    path: ':appraisalId',
    component: AppraisalEditPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalEditPageRoutingModule {}
