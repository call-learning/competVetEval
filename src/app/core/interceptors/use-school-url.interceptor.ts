import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Observable } from 'rxjs'
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
        urlWithParams:
          this.authService.chosenSchool.moodleUrl + request.urlWithParams,
      }
      request = Object.assign(request, newUrl)
    }

    return next.handle(request)
  }
}
