import { Injectable } from '@angular/core'

import { of, throwError, BehaviorSubject } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Appraisal } from '../../shared/models/appraisal.model'
import { MoodleApiService } from '../http-services/moodle-api.service'

@Injectable({
  providedIn: 'root',
})
export class AppraisalService {
  constructor(private moodleApiService: MoodleApiService) {
    // Retrieve situations from localStorage if any ?
  }

  private appraisalEntities = new BehaviorSubject<Appraisal[]>([])

  get appraisals(): Appraisal[] {
    return this.appraisalEntities.getValue()
  }

  retrieveAppraisals(userid) {
    return this.moodleApiService.getUserAppraisals(userid).pipe(
      map((appraisals: Appraisal[]) => {
        this.appraisalEntities.next(appraisals)
        return appraisals
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  submitAppraisal(
    appraisal: Appraisal,
    appraiserId: number,
    studentId: number
  ) {
    return this.moodleApiService
      .submitUserAppraisal(appraisal, appraiserId, studentId)
      .pipe(
        map((appraisals: Appraisal[]) => {
          this.appraisalEntities.next(appraisals)
        }),
        catchError((err) => {
          console.error(err)
          return throwError(err)
        })
      )
  }

  retrieveAppraisal(appraisalId) {
    const localAppraisal = this.appraisalEntities
      .getValue()
      .find((appraisal) => appraisal.id === appraisalId)
    if (localAppraisal) {
      return of(localAppraisal)
    }
    return this.moodleApiService.getAppraisal(appraisalId).pipe(
      map((appraisal: Appraisal) => {
        return appraisal
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }
}
