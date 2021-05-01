/**
 * Application loaded guard
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
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
