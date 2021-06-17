import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { AppraisalEditPageRoutingModule } from './appraisal-edit-routing.module'
import { AppraisalEditPage } from './appraisal-edit.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppraisalEditPageRoutingModule,
    SharedModule,
  ],
  declarations: [AppraisalEditPage],
})
export class AppraisalEditModule {}
