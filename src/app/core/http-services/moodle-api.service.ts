import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Appraisal } from '../../shared/models/appraisal.model'
import { MoodleApiUtils } from '../../shared/utils/moodle-api-utils'

@Injectable({
  providedIn: 'root',
})
export class MoodleApiService {
  constructor(private http: HttpClient) {}

  getUserSituations(userid) {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_user_situations',
      { userid },
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
              description: sit.description,
              startTime: sit.starttime,
              endTime: sit.endtime,
              type: sit.type,
              studentName: sit.studentname,
              studentPictureUrl: sit.studentpictureurl,
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
      { userid },
      this.http
    ).pipe(
      map((res) => {
        return res.map((appr) => {
          // API in Moodle do not use camelcase
          return {
            id: appr.id,
            situationId: appr.situationid,
            situationTitle: appr.situationtitle,
            studentId: appr.studentid,
            appraiserId: appr.appraiserid,
            type: appr.type,
            appraiserName: appr.appraisername,
            appraiserPictureUrl: appr.appraiserpictureurl,
            studentName: appr.studentid,
            studentPictureUrl: appr.studentpictureurl,
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

  getAppraisal(appraisalId) {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_appraisal',
      { appraisalid: appraisalId },
      this.http
    ).pipe(
      map((appr) => {
        // API in Moodle do not use camelcase
        return {
          id: appr.id,
          situationId: appr.situationid,
          situationTitle: appr.situationtitle,
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
        label: crit.label,
        comment: crit.comment,
        timeModified: crit.timemodified,
        subcriteria: this.convertCriteriaAppraisal(crit.subcriteria),
      }
    })
  }

  submitUserAppraisal(
    appraisal: Appraisal,
    appraiserId: number,
    studentId: number
  ) {
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
      situationid: appraisal.situationId,
      appraiserid: appraiserId,
      studentid: studentId,
      context: appraisal.context,
      comment: appraisal.comment,
      criteria: appraisal.criteria.map(formatCriterionForApi),
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

  getCriteria() {
    return MoodleApiUtils.apiCall(
      'local_cveteval_get_criteria',
      {},
      this.http
    ).pipe(
      map((res) => this.convertCriteria(res)),
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
        gridId: crit.gridid,
        subcriteria: this.convertCriteria(crit.subcriteria),
      }
    })
  }
}
