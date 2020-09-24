import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { RotationsListPageRoutingModule } from './rotations-list-routing.module'

import { RotationsListPage } from './rotations-list.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RotationsListPageRoutingModule,
  ],
  declarations: [RotationsListPage],
})
export class RotationsListPageModule {}
