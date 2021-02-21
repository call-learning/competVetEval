import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { EvaluatePage } from './evaluate.page'

const routes: Routes = [
  {
    path: ':situationId/:studentId',
    component: EvaluatePage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluatePageRoutingModule {}
