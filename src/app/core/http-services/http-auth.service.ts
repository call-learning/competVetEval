import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AuthEndpoints } from 'src/app/shared/endpoints/auth.endpoints'
import { LoginResult } from 'src/app/shared/models/auth.model'
import { CevUser } from 'src/app/shared/models/cev-user.model'
import { UserType } from '../../shared/models/user-type.model'
import { MoodleApiUtils } from '../../shared/utils/moodle-api-utils'

@Injectable({
  providedIn: 'root',
})
export class HttpAuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    const formData: FormData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('service', 'moodle_mobile_app')

    return this.http.post(AuthEndpoints.login(), formData).pipe(
      map((res: any) => {
        return new LoginResult(res)
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  getUserProfile() {
    return MoodleApiUtils.apiCall(
      'core_webservice_get_site_info',
      {},
      this.http
    ).pipe(
      map((res) => {
        return new CevUser(res)
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  getUserType(userid) {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_user_type',
      { userid },
      this.http
    ).pipe(
      map((res): 'student' | 'appraiser' => {
        const userType = new UserType(res)
        return userType.type === 'student' ? 'student' : 'appraiser'
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  getUserSituations(userid) {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_user_situations',
      { userid },
      this.http
    ).pipe(
      map((res) => {
        return res.map((sit) => {
          return sit
        })
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }
}
