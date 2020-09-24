import { Location } from '@angular/common'
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { throwError, BehaviorSubject, Observable } from 'rxjs'
import { catchError, exhaustMap, filter, take, timeout } from 'rxjs/operators'

import { AuthService } from '../services/auth.service'

@Injectable()
export class UseSchoolUrlInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.chosenSchool) {
      const newUrl = {
        url: this.authService.chosenSchool.moodleUrl + request.url,
        urlWithParams: this.authService.chosenSchool.moodleUrl + request.url,
      }
      request = Object.assign(request, newUrl)
    }

    return next
      .handle(request)
      .pipe
      // catchError((error: HttpEvent<any>) => {
      //   if (error instanceof HttpErrorResponse && error.status === 400) {
      //     return this.handle400Error(request, next, error);
      //   } else if (error instanceof HttpErrorResponse && error.status === 401) {
      //     return this.handle401Error(request, next, error);
      //   } else if (error instanceof HttpErrorResponse && error.status === 403) {
      //     return this.handle403Error(request, next, error);
      //   } else {
      //     return throwError(error);
      //   }
      // })
      ()
  }

  // private handle400Error(
  //   request: HttpRequest<any>,
  //   next: HttpHandler,
  //   httpError: HttpErrorResponse
  // ): Observable<HttpEvent<any>> {
  //   if (httpError.error.error === 'ERR_CONCURRENT_LOGIN_FOUND') {
  //     this.userService.logout();
  //     const modalData: ModalWarningData = {
  //       title: this.translate.instant('root.limite_connexion'),
  //       content: this.translate.instant('root.limite2'),
  //       buttonText: this.translate.instant('root.deconnexion'),
  //     };

  //     this.matDialog.open(ModalWarningComponent, {
  //       maxWidth: '100vw',
  //       data: modalData,
  //     });
  //   } else if (httpError.error.error === 'ERR_NO_PHPSESSID_HEADER') {
  //     this.userService.logout();
  //   }
  //   return throwError(httpError);
  // }

  // private handle401Error(
  //   request: HttpRequest<any>,
  //   next: HttpHandler,
  //   httpError: HttpErrorResponse
  // ): Observable<HttpEvent<any>> {
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //     this.refreshTokenSubject.next(null);

  //     return this.userService.refreshAuthToken().pipe(
  //       exhaustMap((tokens: LoginResult) => {
  //         this.isRefreshing = false;
  //         this.refreshTokenSubject.next(tokens.access_token);
  //         return next.handle(this.addToken(request, tokens.access_token));
  //       })
  //     );
  //   } else {
  //     return this.refreshTokenSubject.pipe(
  //       filter((token) => token != null),
  //       take(1),
  //       exhaustMap((accessToken: string) => {
  //         return next.handle(this.addToken(request, accessToken));
  //       })
  //     );
  //   }
  // }

  // private handle403Error(
  //   request: HttpRequest<any>,
  //   next: HttpHandler,
  //   httpError: HttpErrorResponse
  // ): Observable<HttpEvent<any>> {
  //   let navigateBack = false;
  //   if (httpError.error.error === 'ERR_FORBIDDEN_PREMIUM_PLUS_REQUIRED') {
  //     this.matDialog.open(ModalPremiumPlusComponent, {
  //       maxWidth: '100vw',
  //     });
  //     navigateBack = true;
  //   } else if (httpError.error.error === 'ERR_FORBIDDEN_PREMIUM_REQUIRED') {
  //     this.matDialog.open(ModalPremiumComponent, {
  //       maxWidth: '100vw',
  //     });
  //     navigateBack = true;
  //   } else if (httpError.error.error === 'ERR_FORBIDDEN_EXAM_NOT_VISIBLE') {
  //     const modalData: ModalWarningData = {
  //       title: this.translate.instant('util.error2'),
  //       content: this.translate.instant('error.visible'),
  //       buttonText: this.translate.instant('util.ok'),
  //     };

  //     this.matDialog.open(ModalWarningComponent, {
  //       maxWidth: '100vw',
  //       data: modalData,
  //     });
  //     navigateBack = true;
  //   } else if (httpError.error.error === 'ERR_FORBIDDEN_PREMIUM_OR_PASS_REQUIRED') {
  //     const modalData: ModalWarningData = {
  //       title: this.translate.instant('root.interdit'),
  //       content: this.translate.instant('root.interdit2'),
  //       buttonText: this.translate.instant('util.ok'),
  //     };

  //     this.matDialog.open(ModalWarningComponent, {
  //       maxWidth: '100vw',
  //       data: modalData,
  //     });
  //     navigateBack = true;
  //   } else if (httpError.error.error === 'ERR_NO_QUESTION_FOUND') {
  //     // do nothing
  //   } else {
  //     const modalData: ModalWarningData = {
  //       title: this.translate.instant('util.error2'),
  //       content: this.translate.instant('util.error'),
  //       buttonText: this.translate.instant('util.ok'),
  //     };

  //     this.matDialog.open(ModalWarningComponent, {
  //       maxWidth: '100vw',
  //       data: modalData,
  //     });
  //   }

  //   if (navigateBack) {
  //     this.location.back();
  //   }

  //   return throwError(httpError);
  // }
}
