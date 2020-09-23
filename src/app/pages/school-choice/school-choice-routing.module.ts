import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SchoolChoicePage } from "./school-choice.page";

const routes: Routes = [
  {
    path: "",
    component: SchoolChoicePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchoolChoicePageRoutingModule {}
