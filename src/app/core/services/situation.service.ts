import { Injectable } from '@angular/core'

import { zip, BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { Situation } from 'src/app/shared/models/situation.model'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class SituationService {
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService
  ) {}

  private situationsEntities = new BehaviorSubject<Situation[]>([])

  get situations(): Situation[] {
    // This might be used as a buffer to store values locally so not to call the API each time.
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
        console.log(situations, appraisals)
        const situationWithEvals = situations.map((sit) => {
          sit.appraisalsCompleted = appraisals.filter(
            (a) => a.situationId === sit.id
          ).length
          sit.status =
            sit.appraisalsRequired - sit.appraisalsCompleted > 0
              ? sit.appraisalsCompleted
                ? 'in_progress'
                : 'todo'
              : 'done'
          return sit
        })
        this.situationsEntities.next(situationWithEvals)
        return situationWithEvals as Situation[]
      })
    )
  }
}
