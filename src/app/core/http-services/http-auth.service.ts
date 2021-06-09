/**
 * Http Auth endpoint
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { throwError, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { LoginResult } from '../../shared/models/auth.model'
import { CevUser } from '../../shared/models/cev-user.model'
import { UserType } from '../../shared/models/user-type.model'
import { MoodleApiUtils } from '../../shared/utils/moodle-api-utils'
import { EndpointsServices } from './endpoints.services'

@Injectable({
  providedIn: 'root',
})
export class HttpAuthService {
  constructor(
    private http: HttpClient,
    private endPointService: EndpointsServices
  ) {}

  /**
   * Login user and get user role
   *
   * @param username
   * @param password
   * @return An Observable of the response and a LoginResult object.
   */
  login(username: string, password: string): Observable<LoginResult> {
    const formData: FormData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('service', 'moodle_mobile_app')

    return this.http.post(this.endPointService.login(), formData).pipe(
      map((res: any) => {
        return new LoginResult(res)
      }),
      catchError((err) => {
        const endpoint = this.endPointService.login()
        console.error(
          `Erreur de connexion: (${err.name}:${err.message}) - ${endpoint}`
        )
        return throwError(err)
      })
    )
  }

  getUserProfile(): Observable<CevUser> {
    return MoodleApiUtils.apiCall(
      'core_webservice_get_site_info',
      {},
      this.http,
      this.endPointService.server()
    ).pipe(
      map((res) => {
        return new CevUser(res)
      }),
      catchError((err) => {
        return throwError(err)
      })
    )
  }

  getUserType(userid): Observable<'student' | 'appraiser'> {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_user_type',
      { userid },
      this.http,
      this.endPointService.server()
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
}
