/**
 * Base Data services
 *
 * Base data that is not dependent on user (scheduledSituation and criteria)
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { EventEmitter, Injectable } from '@angular/core'

import {
  forkJoin,
  of,
  BehaviorSubject,
  Observable,
  combineLatest,
  zip,
} from 'rxjs'
import { filter, first, map, tap } from 'rxjs/operators'
import { BaseMoodleModel } from '../../shared/models/moodle/base-moodle.model'
import { CriterionModel } from '../../shared/models/moodle/criterion.model'
import { GroupAssignmentModel } from '../../shared/models/moodle/group-assignment.model'
import { RoleModel } from '../../shared/models/moodle/role.model'
import { SituationModel } from '../../shared/models/moodle/situation.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService, LOGIN_STATE } from './auth.service'
import Role from '../../../mock/fixtures/role'

/**
 * Load basic user data (stable data that does not change with user interaction with the app), like
 * - situations (all situations, not the ones only for this user as some student can request a "random" evaluation)
 * - criteria / evaluation grid
 * - if current role is an appraiser, then load student information.
 */
@Injectable({
  providedIn: 'root',
})
export class BaseDataService {
  private entities: {
    clsituation: SituationModel[]
    role: RoleModel[]
    group_assign: GroupAssignmentModel[]
  } = {
    clsituation: null,
    role: null,
    group_assign: null,
  }
  private loadingEvents: Map<string, EventEmitter<BaseMoodleModel[]>> = new Map<
    string,
    EventEmitter<BaseMoodleModel[]>
  >()

  /**
   * Build the base data service
   *
   * @param moodleApiService
   * @param authService
   */
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService
  ) {
    this.authService.loginState$.subscribe((loginState) => {
      if (loginState !== LOGIN_STATE.LOGGED) {
        this.resetService()
      }
    })
  }

  public get situations$(): Observable<SituationModel[]> {
    return this.getLoadedEntity('clsituation')
  }

  public get roles$(): Observable<RoleModel[]> {
    return this.getLoadedEntity('role')
  }

  public get groupAssignments$(): Observable<GroupAssignmentModel[]> {
    return this.getLoadedEntity('group_assign')
  }

  private getLoadedEntity(entityType) {
    if (!this.entities[entityType]) {
      return this.refresh(entityType)
    } else {
      return of(this.entities[entityType])
    }
  }

  /**
   * Refresh data and return current information
   *
   * @param entityType
   */
  public refresh(entityType: string): Observable<BaseMoodleModel[]> {
    let loadingEvent = this.loadingEvents.get(entityType)
    if (loadingEvent === undefined) {
      loadingEvent = new EventEmitter<BaseMoodleModel[]>()
      this.loadingEvents.set(entityType, loadingEvent)
      this.refreshFromAPI(entityType).subscribe((model) => {
        this.entities[entityType] = model.map((model) => {
          switch (entityType) {
            case 'clsituation':
              return new SituationModel(model)
            case 'role':
              return new RoleModel(model)
            case 'group_assign':
              return new GroupAssignmentModel(model)
          }
        })
        loadingEvent.emit(this.entities[entityType])
        loadingEvent.complete()
        this.loadingEvents.delete(entityType)
      })
    }
    return loadingEvent.asObservable()
  }

  /**
   * Refresh entities
   *
   * @param entityType
   */
  private refreshFromAPI(entityType): Observable<BaseMoodleModel[]> {
    let query = {}
    if (entityType === 'role') {
      query = { userid: this.authService.loggedUserValue.userid }
    }
    if (entityType === 'group_assign' && this.authService.isStudent) {
      query = { studentid: this.authService.loggedUserValue.userid }
    }
    return this.moodleApiService.fetchMoreRecentData(
      entityType,
      query,
      this.entities ? this.entities[entityType] : null
    )
  }

  /**
   * Reset service
   *
   * @protected
   */
  private resetService() {
    this.entities = {
      clsituation: null,
      role: null,
      group_assign: null,
    }
    this.loadingEvents.clear()
  }
}
