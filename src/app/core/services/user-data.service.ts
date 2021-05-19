/**
 * User data service
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Injectable } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { CevUser } from '../../shared/models/cev-user.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService } from './auth.service'
import { find, tap } from 'rxjs/operators'

/**
 * Load user profile info for a given user or all related users
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  protected userProfiles: CevUser[] = []
  /**
   * Build the user data service
   *
   * @param moodleApiService
   */
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService
  ) {
    this.authService.loggedUser.subscribe((cveUser) => {
      if (!this.authService.isStillLoggedIn()) {
        this.userProfiles = []
      }
    })
  }

  /**
   * Get user profile information
   *
   * This is different from getUserProfile of the auth endpoint but
   * can be merged into one method later.
   * @param userid
   */
  public getUserProfileInfo(userid: number): Observable<CevUser> {
    const exitingProfile = this.userProfiles.find(
      (user) => user.userid == userid
    )
    if (!exitingProfile) {
      return this.moodleApiService
        .getUserProfileInfo(userid)
        .pipe(tap((user) => this.userProfiles.push(user)))
    } else {
      return of(exitingProfile)
    }
  }
}
