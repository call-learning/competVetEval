/**
 * User data service
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Injectable } from '@angular/core'

import { of, Observable, BehaviorSubject } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'
import { CevUser } from '../../shared/models/cev-user.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService } from './auth.service'

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
  protected userProfiles: BehaviorSubject<CevUser[]> = new BehaviorSubject<
    CevUser[]
  >([])
  protected pendingProfiles: Set<number> = new Set<number>()
  /**
   * Build the user data service
   *
   * @param moodleApiService
   */
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService
  ) {
    this.authService.loggedUser$
      .pipe(filter((loggedUser) => !loggedUser))
      .subscribe((cveUser) => {
        this.userProfiles.next([])
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
    if (!userid) {
      return of(null)
    }
    const existingProfile = this.userProfiles
      .getValue()
      .find((user) => user.userid === userid)
    if (existingProfile) {
      return of(existingProfile)
    }
    if (this.pendingProfiles.has(userid)) {
      return this.userProfiles.pipe(
        map((users) => users.find((user) => user.userid === userid)),
        filter((user) => !!user),
        tap((user) => {
          this.pendingProfiles.delete(user.userid)
        })
      )
    }
    this.pendingProfiles.add(userid)
    return this.moodleApiService.getUserProfileInfo(userid).pipe(
      tap((user) => {
        const users = this.userProfiles.getValue()
        users.push(user)
        this.userProfiles.next(users)
      })
    )
  }
}
