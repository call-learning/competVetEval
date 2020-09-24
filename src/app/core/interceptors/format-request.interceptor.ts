import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
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
    return next.handle(request).pipe(timeout(TIME_OUT_DELAY))
  }
}
