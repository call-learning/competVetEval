import { Injectable } from '@angular/core'
import { CanLoad, UrlTree } from '@angular/router'

import { of, Observable } from 'rxjs'
import { AuthService, LOGIN_STATE } from '../services/auth.service'

@Injectable({
  providedIn: 'root',
})
export class ApplicationIsLoadedGuard implements CanLoad {
  constructor(private authService: AuthService) {}

  canLoad():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this.authService.loginState.getValue() !== LOGIN_STATE.ATTEMPT_TO_RECOVER
    ) {
      return of(true)
    } else {
      return this.authService.recoverSession()
    }
  }
}
