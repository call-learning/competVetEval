import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { SchoolChoicePageRoutingModule } from './school-choice-routing.module'
import { SchoolChoicePage } from './school-choice.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchoolChoicePageRoutingModule,
    SharedModule,
  ],
  declarations: [SchoolChoicePage],
})
export class SchoolChoicePageModule {}
