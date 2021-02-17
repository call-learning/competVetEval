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
