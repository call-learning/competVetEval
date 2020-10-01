import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Observable } from 'rxjs'
import { timeout } from 'rxjs/operators'

// timeout after 2 minutes
const TIME_OUT_DELAY = 120 * 1000

@Injectable()
export class FormatRequestInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedRequest = request.clone({
      headers: request.headers.set(
        'Accept',
        'application/json, text/plain, */*'
      ),
    })

    return next.handle(clonedRequest).pipe(timeout(TIME_OUT_DELAY))
  }
}
