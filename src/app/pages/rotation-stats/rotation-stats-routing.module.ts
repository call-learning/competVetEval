import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { RotationStatsPage } from './rotation-stats.page'

const routes: Routes = [
  {
    path: ':rotationId',
    component: RotationStatsPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RotationStatsPageRoutingModule {}
