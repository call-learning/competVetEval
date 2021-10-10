/**
 * Http Auth endpoint
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { LoginResult } from '../../shared/models/auth.model'
import { CevUser } from '../../shared/models/cev-user.model'
import { IdpModel } from '../../shared/models/idp.model'
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
   * Get Idp from website
   *
   * @return An Observable of the response and a Idp[] object.
   */
  getIdps(): Observable<IdpModel[]> {
    const options = {
      params: new HttpParams().set(
        'args',
        JSON.stringify([{ methodname: 'local_cveteval_get_idplist', args: [] }])
      ),
    }
    return this.http.get(this.endPointService.ajaxNoLogin(), options).pipe(
      map((res: any) => {
        const idps = res.pop()
        if (idps && idps.data) {
          return idps.data.map((modeldef) => new IdpModel(modeldef))
        }
        return []
      })
    )
  }

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
    formData.append('service', MoodleApiUtils.getServiceName())

    return this.http.post(this.endPointService.login(), formData).pipe(
      map((res: any) => {
        return new LoginResult(res)
      })
    )
  }

  getUserProfile(): Observable<CevUser> {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_user_profile',
      {},
      this.http,
      this.endPointService.server()
    ).pipe(
      map((res) => {
        return new CevUser(res)
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
      })
    )
  }
}
