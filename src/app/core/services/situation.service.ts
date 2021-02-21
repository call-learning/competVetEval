import { Injectable } from '@angular/core'
import { Situation } from 'src/app/shared/models/situation.model'
import { catchError, map } from 'rxjs/operators'
import { BehaviorSubject, throwError } from 'rxjs'
import { AuthService } from './auth.service'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AppraisalService } from './appraisal.service'
import { EvalGridService } from './evalgrid.service'

@Injectable({
  providedIn: 'root',
})
export class SituationService {
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService,
    private appraisalService: AppraisalService,
    private evalGridService: EvalGridService
  ) {
    // Load appraisals first.
    this.appraisalService.retrieveAppraisals().subscribe()
    this.evalGridService.retrieveEvalGrids().subscribe()
    // this.authService.loginState.subscribe(
    //     (state) => {
    //         if (state == null) {
    //             this.currentSituations.next([])
    //         }
    //     }
    // )
  }

  currentSituations = new BehaviorSubject<Situation[]>([])
  get getSituations(): Situation[] {
    return this.currentSituations.getValue()
  }

  retrieveSituations() {
    return this.moodleApiService
      .getUserSituations(this.authService.loggedUserValue.userid)
      .pipe(
        map((situations: Situation[]) => {
          this.appraisalService.currentAppraisals.subscribe((appraisals) => {
            const situationWithEvals = situations.map((sit) => {
              sit.appraisalsCompleted = appraisals.filter(
                (a) => a.situationId == sit.id
              ).length
              sit.status =
                sit.appraisalsCompleted - sit.appraisalsRequired
                  ? sit.appraisalsCompleted
                    ? 'in_progress'
                    : 'todo'
                  : 'done'
              return sit
            })
            this.currentSituations.next(situationWithEvals)
          })
        }),
        catchError((err) => {
          console.error(err)
          return throwError(err)
        })
      )
  }
}
