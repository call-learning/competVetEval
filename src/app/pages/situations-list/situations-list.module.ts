/**
 * Situation list module
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { SituationsListPageRoutingModule } from './situations-list-routing.module'
import { SituationsListPage } from './situations-list.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SituationsListPageRoutingModule,
    SharedModule,
  ],
  declarations: [SituationsListPage],
})
export class SituationsListPageModule {}
