import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { SituationsListPage } from './situations-list.page'

const routes: Routes = [
  {
    path: '',
    component: SituationsListPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SituationsListPageRoutingModule {}
