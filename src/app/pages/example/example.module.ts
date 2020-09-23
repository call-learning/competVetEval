import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SharedModule } from "../../shared/shared.module";
import { ExamplePageRoutingModule } from "./example-routing.module";
import { ExamplePage } from "./example.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamplePageRoutingModule,
    SharedModule,
  ],
  declarations: [ExamplePage],
})
export class ExamplePageModule {}
