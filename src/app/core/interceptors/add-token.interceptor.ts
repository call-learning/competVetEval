/**
 * Add token interceptor
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ToastController } from '@ionic/angular'

import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { AuthService } from '../services/auth.service'

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {}

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
        if (res && res.body && res.body.errorcode === 'invalidtoken') {
          this.handleTokenError()
          throw new Error(res.body.errorcode)
        } else if (res && res.body && res.body.errorcode) {
          this.toastController
            .create({
              message: `Erreur: (${res.body.errorcode}:${res.body.message}) - ${request.url}`,
              duration: 2000,
              color: 'danger',
            })
            .then((toast) => {
              toast.present()
            })
          throw new Error(res.body.errorcode)
        }
      }),
      catchError((error: HttpEvent<any>) => {
        if (error instanceof HttpErrorResponse) {
          console.error(`[HTTP ERROR ${error.status}]`, error)
          this.toastController
            .create({
              message: `Erreur HTTP: ${error.status} - ${request.url}`,
              duration: 2000,
              color: 'danger',
            })
            .then((toast) => {
              toast.present()
            })
        } else {
          console.error('[UNDEFINED REQUEST ERROR]', error)
          this.toastController
            .create({
              message: `Erreur indéfinie: ${request.url}`,
              duration: 2000,
              color: 'danger',
            })
            .then((toast) => {
              toast.present()
            })
        }
        return throwError(error)
      })
    )
  }

  private handleTokenError() {
    this.authService.logout()
  }
}
