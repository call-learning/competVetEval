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

import { SituationModel } from '../../shared/models/moodle/situation.model'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { CriterionModel } from '../../shared/models/moodle/criterion.model'
import { BaseMoodleModel } from '../../shared/models/moodle/base-moodle.model'
import { Injectable } from '@angular/core'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService } from './auth.service'
import { map, mergeMap, tap } from 'rxjs/operators'
import { CevUser } from '../../shared/models/cev-user.model'
import { RoleModel } from '../../shared/models/moodle/role.model'
import { GroupAssignmentModel } from '../../shared/models/moodle/group-assignment.model'
import { CriterionEvalgridModel } from '../../shared/models/moodle/criterion-evalgrid.model'

const EntityClass: any = {
  clsituation: SituationModel,
  criterion: CriterionModel,
  cevalgrid: CriterionEvalgridModel,
  role: RoleModel,
  group_assign: GroupAssignmentModel,
}

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
  private entities = {
    clsituation: new BehaviorSubject<SituationModel[]>(null),
    criterion: new BehaviorSubject<CriterionModel[]>(null),
    cevalgrid: new BehaviorSubject<CriterionEvalgridModel[]>(null),
    role: new BehaviorSubject<RoleModel[]>(null),
    group_assign: new BehaviorSubject<GroupAssignmentModel[]>(null),
  }

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
    this.authService.loggedUser.subscribe((cveUser) => {
      if (cveUser) {
        for (const entityName in this.entities) {
          this.refresh(entityName).subscribe()
          // Subscribe for the the whole service lifetime
        }
      } else {
        for (const entityName in this.entities) {
          this.entities[entityName].next(null)
        }
      }
    })
  }

  /**
   * Get current situations
   */
  public get situations(): BehaviorSubject<SituationModel[]> {
    return this.entities.clsituation
  }

  /**
   * Get current criteria
   */
  public get criteria(): BehaviorSubject<CriterionModel[]> {
    return this.entities.criterion
  }

  /**
   * Get current criteria evaluation grid
   */
  public get criteriaEvalgrid(): BehaviorSubject<CriterionEvalgridModel[]> {
    return this.entities.cevalgrid
  }
  /**
   * Get role for current logged in user
   */
  public get roles(): BehaviorSubject<RoleModel[]> {
    return this.entities.role
  }

  /**
   * Get group assignment model
   */
  public get groupAssignment(): BehaviorSubject<GroupAssignmentModel[]> {
    return this.entities.group_assign
  }

  /**
   * Get entity by Id
   *
   * @param entityType
   * @param id
   */
  public getEntityById(entityType, id): BaseMoodleModel | null {
    const entities = this.entities[entityType].getValue()
    if (entities) {
      return entities.find((entity) => entity.id == id)
    }
    return null
  }

  /**
   * Refresh data and return current information
   *
   * @param entityType
   */
  public refresh(entityType: string): Observable<BaseMoodleModel[]> {
    if (this.authService.isStillLoggedIn()) {
      let query = {}
      if (entityType == 'role') {
        query = { userid: this.authService.loggedUser.getValue().userid }
      }
      if (this.authService.isStillLoggedIn()) {
        return this.doRefreshData(entityType, query)
      }
      return this.authService.loggedUser.pipe(
        mergeMap((user: CevUser) => {
          if (user) {
            return this.doRefreshData(entityType, query)
          }
          return null
        })
      )
    } else {
      return of([])
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
    return this.moodleApiService
      .fetchIfMoreRecent(
        entityType,
        query,
        this.entities[entityType].getValue()
      )
      .pipe(
        tap((entities: BaseMoodleModel[]) => {
          this.entities[entityType].next(
            entities.map((e) => new EntityClass[entityType](e))
          )
        })
      )
  }
}
