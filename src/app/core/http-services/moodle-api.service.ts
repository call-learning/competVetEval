import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AuthEndpoints } from 'src/app/shared/endpoints/auth.endpoints'
import { LoginResult } from 'src/app/shared/models/auth.model'
import { CevUser } from 'src/app/shared/models/cev-user.model'
import { UserType } from '../../shared/models/user-type.model'
import { MoodleApiUtils } from '../../shared/utils/moodle-api-utils'
import { Appraisal } from '../../shared/models/appraisal.model'
import { CriteriaAppraisal } from '../../shared/models/criteria-appraisal.model'

@Injectable({
  providedIn: 'root',
})
export class MoodleApiService {
  constructor(private http: HttpClient) {}

  getUserSituations(userid) {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_user_situations',
      { userid: userid },
      this.http
    ).pipe(
      map((res) => {
        return res.map(
          // API in Moodle do not use camelcase
          (sit) => {
            sit.appraisalsCompleted = 0
            sit.status = 'done'
            return {
              id: sit.id,
              title: sit.title,
              startTime: sit.starttime,
              endTime: sit.endtime,
              type: sit.type,
              studentName: sit.studentname,
              studentId: sit.studentid,
              appraisalsRequired: sit.appraisalsrequired,
            }
          }
        )
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  getUserAppraisals(userid) {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_user_appraisals',
      { userid: userid },
      this.http
    ).pipe(
      map((res) => {
        return res.map((appr) => {
          // API in Moodle do not use camelcase
          return {
            id: appr.id,
            situationId: appr.situationid,
            studentId: appr.studentid,
            appraiserId: appr.appraiserid,
            type: appr.type,
            appraiserName: appr.appraisername,
            studentName: appr.studentid,
            context: appr.context,
            comment: appr.comment,
            criteria: this.convertCriteriaAppraisal(appr.criteria),
            timeModified: appr.timemodified,
          }
        })
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  private convertCriteriaAppraisal(crits) {
    if (typeof crits === 'undefined') {
      return []
    }
    return crits.map((crit) => {
      return {
        id: crit.id,
        criterionId: crit.criterionid,
        grade: crit.grade,
        comment: crit.comment,
        timeModified: crit.timemodified,
        subcriteria: this.convertCriteriaAppraisal(crit.subcriteria),
      }
    })
  }

  submitUserAppraisal(appraiserId: number, appraisal: Appraisal) {
    const args = {
      appraiserId: appraiserId,
    }
    return MoodleApiUtils.apiCall(
      'local_cveteval_set_user_appraisal',
      args,
      this.http
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

  getEvalGrids() {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_eval_grids',
      {},
      this.http
    ).pipe(
      map((res) => {
        // API in Moodle do not use camelcase
        return res.map((grid) => {
          return {
            id: grid.id,
            criteria: this.convertCriteria(grid.criteria),
          }
        })
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  private convertCriteria(crits) {
    if (typeof crits === 'undefined') {
      return []
    }
    return crits.map((crit) => {
      return {
        id: crit.id,
        label: crit.label,
        sort: crit.sort,
        subcriteria: this.convertCriteria(crit.subcriteria),
      }
    })
  }
}
