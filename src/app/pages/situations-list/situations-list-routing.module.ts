/**
 * SituationModel List routing page
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

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
