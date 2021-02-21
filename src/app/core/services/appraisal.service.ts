import { Injectable } from '@angular/core'
import { Situation } from 'src/app/shared/models/situation.model'
import { catchError, map } from 'rxjs/operators'
import { BehaviorSubject, throwError } from 'rxjs'
import { AuthService } from './auth.service'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { Appraisal } from '../../shared/models/appraisal.model'
import { EvalGrid } from '../../shared/models/eval-grid.model'

@Injectable({
  providedIn: 'root',
})
export class AppraisalService {
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService
  ) {
    // Retrieve situations from localStorage if any ?
  }

  currentAppraisals = new BehaviorSubject<Appraisal[]>([])

  get getAppraisals(): Appraisal[] {
    return this.currentAppraisals.getValue()
  }

  retrieveAppraisals() {
    return this.moodleApiService
      .getUserAppraisals(this.authService.loggedUserValue.userid)
      .pipe(
        map((appraisals: Appraisal[]) => {
          this.currentAppraisals.next(appraisals)
        }),
        catchError((err) => {
          console.error(err)
          return throwError(err)
        })
      )
  }
  submitAppraisal(appraisal: Appraisal) {
    return this.moodleApiService
      .submitUserAppraisal(this.authService.loggedUserValue.userid, appraisal)
      .pipe(
        map((appraisals: Appraisal[]) => {
          this.currentAppraisals.next(appraisals)
        }),
        catchError((err) => {
          console.error(err)
          return throwError(err)
        })
      )
  }
}
