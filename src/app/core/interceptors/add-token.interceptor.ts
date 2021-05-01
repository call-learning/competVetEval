/**
 * Add token interceptor
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { AuthService } from '../services/auth.service'

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.indexOf('svg-icons/') === -1) {
      if (this.authService.accessToken) {
        request.body.append('wstoken', this.authService.accessToken)
      }
    }

    return next.handle(request).pipe(
      tap((res: any) => {
        if (res && res.body && res.body.errorcode) {
          this.handleTokenError(res.body.errorcode)
          throw new Error(res.body.errorcode)
        }
      })
    )
  }

  private handleTokenError(errorCode) {
    if (errorCode === 'invalidtoken') {
      this.authService.logout()
    }
  }
}
