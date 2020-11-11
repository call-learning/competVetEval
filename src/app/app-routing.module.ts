import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

import { ApplicationIsLoadedGuard } from './core/guards/application-is-loaded.guard'
import { AuthenticatedGuard } from './core/guards/authenticated.guard'
import { GuestGuard } from './core/guards/guest.guard'
import { SchoolGuard } from './core/guards/school.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'rotations-list',
    pathMatch: 'full',
  },
  {
    path: 'school-choice',
    loadChildren: () =>
      import('./pages/school-choice/school-choice.module').then(
        (m) => m.SchoolChoicePageModule
      ),
    canLoad: [ApplicationIsLoadedGuard],
    canActivate: [GuestGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canLoad: [ApplicationIsLoadedGuard],
    canActivate: [SchoolGuard, GuestGuard],
  },
  {
    path: 'rotations-list',
    loadChildren: () =>
      import('./pages/rotations-list/rotations-list.module').then(
        (m) => m.RotationsListPageModule
      ),
    canLoad: [ApplicationIsLoadedGuard],
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
  {
    path: 'rotation-detail',
    loadChildren: () =>
      import('./pages/rotation-detail/rotation-detail.module').then(
        (m) => m.RotationDetailPageModule
      ),
    canLoad: [ApplicationIsLoadedGuard],
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
  {
    path: 'evaluation-detail',
    loadChildren: () =>
      import('./pages/evaluation-detail/evaluation-detail.module').then(
        (m) => m.EvaluationDetailPageModule
      ),
    canLoad: [ApplicationIsLoadedGuard],
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
  {
    path: 'create-evaluation',
    loadChildren: () =>
      import('./pages/create-evaluation/create-evaluation.module').then(
        (m) => m.CreateEvaluationPageModule
      ),
    canLoad: [ApplicationIsLoadedGuard],
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
  {
    path: 'start-evaluation',
    loadChildren: () =>
      import('./pages/start-evaluation/start-evaluation.module').then(
        (m) => m.StartEvaluationPageModule
      ),
    canLoad: [ApplicationIsLoadedGuard],
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
  {
    path: 'precise-criterion',
    loadChildren: () =>
      import('./pages/precise-criterion/precise-criterion.module').then(
        (m) => m.PreciseCriterionPageModule
      ),
    canLoad: [ApplicationIsLoadedGuard],
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
