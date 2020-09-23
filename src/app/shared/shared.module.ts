import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { AngularSvgIconModule } from "angular-svg-icon";

@NgModule({
  declarations: [],
  imports: [CommonModule, AngularSvgIconModule, ReactiveFormsModule],
  exports: [AngularSvgIconModule, ReactiveFormsModule],
})
export class SharedModule {}
