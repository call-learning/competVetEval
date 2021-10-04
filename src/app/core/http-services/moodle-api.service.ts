/**
 * Moodle API service
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { of, throwError, Observable, iif } from 'rxjs'
import { catchError, concatMap, map, mergeMap, tap } from 'rxjs/operators'
import { CevUser } from '../../shared/models/cev-user.model'
import { AppraisalCriterionModel } from '../../shared/models/moodle/appraisal-criterion.model'
import { AppraisalModel } from '../../shared/models/moodle/appraisal.model'
import { BaseMoodleModel } from '../../shared/models/moodle/base-moodle.model'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'
import { MoodleApiUtils } from '../../shared/utils/moodle-api-utils'
import { EndpointsServices } from './endpoints.services'

@Injectable({
  providedIn: 'root',
})
export class MoodleApiService {
  constructor(
    private http: HttpClient,
    private endPointService: EndpointsServices
  ) {}

  /**
   * Get entities from their name
   *
   * This assumes that there is an API on the moodle side that will answer the
   * local_cveteval_get_entities with:
   * - entitytype: the entity to retrieve (the server will validate access)
   * - query: a json object with a set of defined fields / value to filter the entities with
   * @param entityType
   * @param args
   */
  public getEntities(entityType, args): Observable<BaseMoodleModel[]> {
    return MoodleApiUtils.apiCall(
      `local_cveteval_get_${entityType}`,
      args
        ? {
            query: JSON.stringify(args),
          }
        : {},
      this.http,
      this.endPointService.server()
    ).pipe(
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  /**
   * Fetch from Moodle table if more recent
   *
   * @param entityType
   * @param args
   * @param currentEntities
   */
  public fetchMoreRecentData(
    entityType: string,
    args: object,
    currentEntities: BaseMoodleModel[]
  ): Observable<BaseMoodleModel[]> {
    if (!!currentEntities) {
      return this.fetchIfMoreRecent(entityType, args, currentEntities)
    } else {
      return this.getEntities(entityType, args)
    }
  }

  fetchIfMoreRecent(
    entityType: string,
    args: object,
    currentEntities: BaseMoodleModel[]
  ): Observable<BaseMoodleModel[]> {
    return this.getLatestModificationDate(entityType, args).pipe(
      concatMap((latestModif: number) => {
        const currentStoredEntitiesMaxModified = currentEntities.reduce(
          (acc, entity) =>
            acc > entity.timemodified ? acc : entity.timemodified,
          0
        )
        if (currentStoredEntitiesMaxModified >= latestModif) {
          return of(currentEntities)
        } else {
          return this.getEntities(entityType, args)
        }
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  // nnkitodo[FUNCTION]
  public submitUserAppraisal(appraisal: AppraisalUI) {
    const formatCriterionForApi = (criteria) => {
      const apiCrit: any = {
        grade: criteria.grade,
        criterionid: criteria.criterionId,
        comment: criteria.comment,
        subcriteria: criteria.subcriteria.map(formatCriterionForApi),
      }
      if (typeof criteria.id !== 'undefined') {
        apiCrit.id = criteria.id
      }
      return apiCrit
    }
    const args = {
      id: appraisal.id,
      context: appraisal.context,
      comment: appraisal.comment,
      criteria: appraisal.criteria.map(formatCriterionForApi),
    }
    return MoodleApiUtils.apiCall(
      'local_cveteval_set_user_appraisal',
      args,
      this.http,
      this.endPointService.server()
    ).pipe(
      map((res) => {
        return res
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  public getLatestModificationDate(entityType, args) {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_latest_modifications',
      this.getEntityQuery(entityType, args),
      this.http,
      this.endPointService.server()
    ).pipe(
      map((latestmodifobject) => {
        const { latestmodifications } = latestmodifobject
        return latestmodifications as number
      })
    )
  }

  /**
   *
   * @param entityType
   * @param queryArgs
   * @protected
   */
  protected getEntityQuery(entityType, queryArgs) {
    if (queryArgs) {
      return {
        entitytype: entityType,
        query: JSON.stringify(queryArgs),
      }
    }
    return {
      entitytype: entityType,
    }
  }

  /**
   * Get user profile information
   *
   * This is different from getUserProfile of the auth endpoint but
   * can be merged into one method later.
   * @param userid
   */
  public getUserProfileInfo(userid: number): Observable<CevUser> {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_user_profile',
      { userid },
      this.http,
      this.endPointService.server()
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

  /**
   * Submit a new appraisal remotely
   *
   * @param appraisalModel
   * @param appraisalCriteriaModel
   */
  // nnkitodo[FUNCTION]
  public submitAppraisal(
    appraisalModel: AppraisalModel
  ): Observable<AppraisalModel> {
    return MoodleApiUtils.apiCall(
      'local_cveteval_submit_appraisal',
      {
        ...appraisalModel,
      },
      this.http,
      this.endPointService.server()
    ).pipe(
      map((res) => {
        return new AppraisalModel(res)
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  /**
   * Submit a new appraisal remotely
   *
   * @param appraisalModel
   * @param appraisalCriteriaModel
   */
  // nnkitodo[FUNCTION]
  public submitAppraisalCriteria(
    appraisalCriteriaModels: AppraisalCriterionModel[]
  ): Observable<AppraisalCriterionModel[]> {
    return MoodleApiUtils.apiCall(
      'local_cveteval_submit_appraisal_criteria',
      {
        appraisalcriteriamodels: appraisalCriteriaModels,
      },
      this.http,
      this.endPointService.server()
    ).pipe(
      map((res) => {
        return res.map((apprcrit) => new AppraisalCriterionModel(apprcrit))
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }
}
