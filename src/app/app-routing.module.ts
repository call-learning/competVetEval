import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { ApplicationIsLoadedGuard } from "./core/guards/application-is-loaded.guard";
import { SchoolGuard } from "./core/guards/school.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "school-choice",
    loadChildren: () =>
      import("./pages/school-choice/school-choice.module").then(
        (m) => m.SchoolChoicePageModule
      ),
    canLoad: [ApplicationIsLoadedGuard],
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
    canLoad: [ApplicationIsLoadedGuard],
    canActivate: [SchoolGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
