import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

import { AuthenticatedGuard } from './core/guards/authenticated.guard'
import { GuestGuard } from './core/guards/guest.guard'
import { SchoolGuard } from './core/guards/school.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'situations-list',
    pathMatch: 'full',
  },
  {
    path: 'school-choice',
    loadChildren: () =>
      import('./pages/school-choice/school-choice.module').then(
        (m) => m.SchoolChoicePageModule
      ),
    canActivate: [GuestGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [SchoolGuard, GuestGuard],
  },
  {
    path: 'situations-list',
    loadChildren: () =>
      import('./pages/situations-list/situations-list.module').then(
        (m) => m.SituationsListPageModule
      ),
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
  {
    path: 'scheduled-situation-detail',
    loadChildren: () =>
      import('./pages/situation-detail/situation-detail.module').then(
        (m) => m.SituationDetailPageModule
      ),
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
  {
    path: 'appraisal-detail',
    loadChildren: () =>
      import('./pages/appraisal-detail/appraisal-detail.module').then(
        (m) => m.AppraisalDetailPageModule
      ),
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
  {
    path: 'appraisal-edit',
    loadChildren: () =>
      import('./pages/appraisal-edit/appraisal-edit.module').then(
        (m) => m.AppraisalEditModule
      ),
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
  {
    path: 'evaluate',
    loadChildren: () =>
      import('./pages/evaluate/evaluate.module').then(
        (m) => m.EvaluatePageModule
      ),
    canActivate: [SchoolGuard, AuthenticatedGuard],
  },
  {
    path: '**',
    redirectTo: 'situations-list',
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
