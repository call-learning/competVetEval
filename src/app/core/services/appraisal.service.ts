import { Injectable } from '@angular/core'

import { of, throwError, BehaviorSubject } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Appraisal } from '../../shared/models/appraisal.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class AppraisalService {
  public appraisalEntities = new BehaviorSubject<Appraisal[]>(null)

  constructor(
    private moodleApiService: MoodleApiService,
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

  submitAppraisal(
    appraisal: Appraisal,
    appraiserId: number,
    studentId: number
  ) {
    return this.moodleApiService
      .submitUserAppraisal(appraisal, appraiserId, studentId)
      .pipe(
        tap((appraisal: Appraisal) => {
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
}
