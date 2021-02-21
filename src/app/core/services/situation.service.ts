import { Injectable } from '@angular/core'
import { Situation } from 'src/app/shared/models/situation.model'
import { catchError, map } from 'rxjs/operators'
import { BehaviorSubject, throwError, zip } from 'rxjs'
import { AuthService } from './auth.service'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AppraisalService } from './appraisal.service'
import { CriteriaService } from './criteria.service'

@Injectable({
  providedIn: 'root',
})
export class SituationService {
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService,
    private appraisalService: AppraisalService
  ) {
    // Load appraisals first.
    // this.authService.loginState.subscribe(
    //     (state) => {
    //         if (state == null) {
    //             this.currentSituations.next([])
    //         }
    //     }
    // )
  }

  private situationsEntities = new BehaviorSubject<Situation[]>([])

  get situations(): Situation[] {
    return this.situationsEntities.getValue()
  }

  retrieveSituations() {
    return zip(
      this.moodleApiService.getUserSituations(
        this.authService.loggedUserValue.userid
      ),
      this.moodleApiService.getUserAppraisals(
        this.authService.loggedUserValue.userid
      )
    ).pipe(
      map(([situations, appraisals]) => {
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
        this.situationsEntities.next(situationWithEvals)
        return situationWithEvals
      })
    )
  }
}
