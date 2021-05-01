/**
 * Moodle API service
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Observable, of, throwError } from 'rxjs'
import { BaseMoodleModel } from '../../shared/models/moodle/base-moodle.model'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'
import { HttpClient } from '@angular/common/http'
import { EndpointsServices } from './endpoints.services'
import { MoodleApiUtils } from '../../shared/utils/moodle-api-utils'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { UserType } from '../../shared/models/user-type.model'
import { CevUser } from '../../shared/models/cev-user.model'
import { AppraisalModel } from '../../shared/models/moodle/appraisal.model'
import { AppraisalCriterionModel } from '../../shared/models/moodle/appraisal-criterion.model'

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
      `local_cveteval_get_entities`,
      this.getEntityQuery(entityType, args),
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
  public fetchIfMoreRecent(
    entityType: string,
    args: object,
    currentEntities: BaseMoodleModel[]
  ): Observable<BaseMoodleModel[]> {
    return this.getLatestModificationDate(entityType, args).pipe(
      map((latestModif: number) => {
        if (currentEntities) {
          const currentStoredEntitiesMaxModified = currentEntities.reduce(
            (acc, entity) =>
              acc > entity.timemodified ? acc : entity.timemodified,
            0
          )
          if (currentStoredEntitiesMaxModified >= latestModif) {
            return of(currentEntities)
          }
        }
        return this.getEntities(entityType, args)
      }),
      mergeMap((value) => value),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

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
    let args = {
      id: appraisal.id,
      // situationid: appraisal.evalPlanId,
      // appraiserid: appraisal.appraiserId,
      // studentid: appraisal.studentId,
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
  public submitAppraisal(
    appraisalModel: AppraisalModel
  ): Observable<AppraisalModel> {
    return MoodleApiUtils.apiCall(
      'local_cveteval_submit_appraisal',
      {
        appraisalmodel: appraisalModel,
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
  public submitAppraisalCriteria(
    appraisalCriteriaModel: AppraisalCriterionModel[]
  ): Observable<AppraisalCriterionModel[]> {
    return MoodleApiUtils.apiCall(
      'local_cveteval_submit_appraisal_criteria',
      {
        appraisalcriteriamodel: appraisalCriteriaModel,
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
