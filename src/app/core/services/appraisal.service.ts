import { Injectable } from '@angular/core'

import { of, throwError, BehaviorSubject } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { Appraisal } from '../../shared/models/appraisal.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService } from './auth.service'
import { Criterion } from '../../shared/models/criterion.model'
import { CriterionAppraisal } from '../../shared/models/criterion-appraisal.model'
import { CriteriaService } from './criteria.service'
import { SituationService } from './situation.service'

@Injectable({
  providedIn: 'root',
})
export class AppraisalService {
  public appraisalEntities = new BehaviorSubject<Appraisal[]>(null)

  constructor(
    private moodleApiService: MoodleApiService,
    private criteriaService: CriteriaService,
    private situationService: SituationService,
    private authService: AuthService
  ) {
    this.authService.loggedUser.subscribe((res) => {
      if (!res) {
        this.appraisalEntities.next(null)
      }
    })
  }

  retrieveAppraisals(userid) {
    return this.moodleApiService.getUserAppraisals(userid).pipe(
      tap((appraisals: Appraisal[]) => {
        this.appraisalEntities.next(appraisals)
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  submitAppraisal(appraisal: Appraisal) {
    return this.moodleApiService.submitUserAppraisal(appraisal).pipe(
      map((appraisal: Appraisal) => {
        let allAppraisals = this.appraisalEntities.value
        if (allAppraisals) {
          let foundAppraisal = false
          allAppraisals.forEach((app) => {
            if (app.id == appraisal.id) {
              Object.assign(app, appraisal)
              foundAppraisal = true
            }
          })
          if (!foundAppraisal) {
            allAppraisals.push(appraisal)
          }
          this.appraisalEntities.next(allAppraisals)
        }
        return appraisal
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  retrieveAppraisal(appraisalId) {
    // if (this.appraisalEntities.getValue()) {
    //   const localAppraisal = this.appraisalEntities
    //     .getValue()
    //     .find((appraisal) => appraisal.id === appraisalId)
    //   if (localAppraisal) {
    //     return of(localAppraisal)
    //   }
    // }

    return this.moodleApiService.getAppraisal(appraisalId).pipe(
      tap((appraisal: Appraisal) => {
        return appraisal
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
    return null
  }

  createBlankAppraisal(situationId, studentId, appraiserId) {
    return this.criteriaService.retrieveCriteria().pipe(
      map((criteria: Criterion[]) => {
        const transformCriteriaIntoAppraisalCriteria = (crit: Criterion) =>
          new CriterionAppraisal({
            criterionId: crit.id,
            label: crit.label,
            comment: '',
            grade: 0,
            subcriteria: crit.subcriteria.map(
              transformCriteriaIntoAppraisalCriteria
            ),
          })
        const criterionAppraisal = criteria.map(
          transformCriteriaIntoAppraisalCriteria
        )
        const appraisal = new Appraisal({
          situationId: situationId,
          situationTitle: '',
          context: '',
          comment: '',
          appraiserId: appraiserId,
          type: 1,
          studentId: studentId,
          timeModified: Date.now(),
          criteria: criterionAppraisal,
        })
        return appraisal
      })
    )
  }
}
