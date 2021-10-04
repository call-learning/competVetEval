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

import { Injectable } from '@angular/core'

import { of, BehaviorSubject, Observable, forkJoin } from 'rxjs'
import { filter, first, map, tap } from 'rxjs/operators'
import { BaseMoodleModel } from '../../shared/models/moodle/base-moodle.model'
import { CriterionEvalgridModel } from '../../shared/models/moodle/criterion-evalgrid.model'
import { CriterionModel } from '../../shared/models/moodle/criterion.model'
import { GroupAssignmentModel } from '../../shared/models/moodle/group-assignment.model'
import { RoleModel } from '../../shared/models/moodle/role.model'
import { SituationModel } from '../../shared/models/moodle/situation.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService, LOGIN_STATE } from './auth.service'

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
    situations: SituationModel[]
    criteria: CriterionModel[]
    criteriaEvalGrid: CriterionEvalgridModel[]
    roles: RoleModel[]
    groupAssignments: GroupAssignmentModel[]
  } = null

  private isLoaded$ = new BehaviorSubject<boolean>(false)
  private isLoading = false

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

  resetService() {
    this.entities = null
    this.isLoaded$.next(false)
    this.isLoading = false
  }

  public get situations$(): Observable<SituationModel[]> {
    return this.getLoadedEntity('situations')
  }

  public get criteria$(): Observable<CriterionModel[]> {
    return this.getLoadedEntity('criteria')
  }

  public get criteriaEvalGrid$(): Observable<CriterionEvalgridModel[]> {
    return this.getLoadedEntity('criteriaEvalGrid')
  }

  public get roles$(): Observable<RoleModel[]> {
    return this.getLoadedEntity('roles')
  }

  public get groupAssignments$(): Observable<GroupAssignmentModel[]> {
    return this.getLoadedEntity('groupAssignments')
  }

  private getLoadedEntity(entityType) {
    if (this.entities === null) {
      if (!this.isLoading) {
        return this.refreshAllEntities().pipe(
          tap(() => {
            this.isLoading = false
            this.isLoaded$.next(true)
          }),
          map(() => {
            return this.entities[entityType]
          })
        )
      } else {
        return this.isLoaded$.pipe(
          filter((isLoaded) => !!isLoaded),
          first(),
          map(() => {
            return this.entities[entityType]
          })
        )
      }
    } else {
      return of(this.entities[entityType])
    }
  }

  refreshAllEntities() {
    this.isLoading = true
    console.log('initiate refresh base data')
    return forkJoin([
      this.refresh('clsituation'),
      this.refresh('criterion'),
      this.refresh('cevalgrid'),
      this.refresh('role'),
      this.refresh('group_assign'),
    ]).pipe(
      tap(
        ([situations, criteria, criteriaEvalGrid, roles, groupAssignments]) => {
          this.entities = {
            situations: situations.map((elt) => new SituationModel(elt)),
            criteria: criteria.map((elt) => new CriterionModel(elt)),
            criteriaEvalGrid: criteriaEvalGrid.map(
              (elt) => new CriterionEvalgridModel(elt)
            ),
            roles: roles.map((elt) => new RoleModel(elt)),
            groupAssignments: groupAssignments.map(
              (elt) => new GroupAssignmentModel(elt)
            ),
          }
          console.log('refresh base data service', this.entities)
          this.isLoaded$.next(true)
        }
      )
    )
  }

  /**
   * Refresh data and return current information
   *
   * @param entityType
   */
  public refresh(entityType: string): Observable<BaseMoodleModel[]> {
    if (this.authService.isStillLoggedIn()) {
      let query = {}
      if (entityType === 'role') {
        query = { userid: this.authService.loggedUser$.getValue().userid }
      }
      return this.doRefreshData(entityType, query)
    } else {
      return of(null)
    }
  }

  /**
   * Refresh entities
   *
   * @param entityType
   */
  private doRefreshData(
    entityType,
    query: object
  ): Observable<BaseMoodleModel[]> {
    return this.moodleApiService.fetchMoreRecentData(
      entityType,
      query,
      this.entities ? this.entities[entityType] : null
    )
  }
}
