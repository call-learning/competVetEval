/**
 * User data service
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Injectable } from '@angular/core'

import { of, Observable, BehaviorSubject, Subject } from 'rxjs'
import { CevUser } from '../../shared/models/cev-user.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService, LOGIN_STATE } from './auth.service'
import { tap } from 'rxjs/operators'

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
  private userProfiles: Map<number, CevUser> = new Map<number, CevUser>()

  // If if this not null, then we are currently loading, so we need
  // to wait for the process to finish.
  private loadingEvents: Map<number, Subject<CevUser>> = new Map<
    number,
    Subject<CevUser>
  >()

  /**
   * Build the user data service
   *
   * @param moodleApiService
   */
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService
  ) {
    this.authService.loggedUser$.subscribe((loggedUser) => {
      if (!loggedUser) {
        this.userProfiles.clear()
        this.loadingEvents.clear()
      } else {
        this.userProfiles.set(loggedUser.userid, loggedUser)
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
    if (!userid) {
      return of(null)
    }
    if (this.userProfiles.has(userid)) {
      return of(this.userProfiles.get(userid))
    }
    return this.retrieveUserData(userid)
  }

  /**
   * Helper
   *
   * @param userid
   * @private
   */
  private retrieveUserData(userid: number): Observable<CevUser> {
    let loadingEvent = this.loadingEvents.get(userid)
    if (loadingEvent && !loadingEvent.isStopped) {
      return loadingEvent.asObservable()
    }
    loadingEvent = new Subject<CevUser>()
    this.loadingEvents.set(userid, loadingEvent)
    return this.moodleApiService.getUserProfileInfo(userid).pipe(
      tap((user) => {
        loadingEvent.next(user)
        loadingEvent.complete()
        this.loadingEvents.delete(userid)
        this.userProfiles.set(userid, user)
      })
    )
  }
}
