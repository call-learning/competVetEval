/**
 * School guard
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'

import { Observable } from 'rxjs'
import { AuthService } from '../services/auth.service'

@Injectable({
  providedIn: 'root',
})
export class SchoolGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.chosenSchool) {
      return true
    } else {
      this.router.navigate(['/school-choice'])
      return false
    }
  }
}
