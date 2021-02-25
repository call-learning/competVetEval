import { Injectable } from '@angular/core'

import { zip, BehaviorSubject, Observable } from 'rxjs'
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
  ) {
    this.authService.loggedUser.subscribe((res) => {
      if (!res) {
        this.situationsEntities.next(null)
      }
    })
  }

  private situationsEntities = new BehaviorSubject<Situation[]>(null)

  get situations$(): Observable<Situation[]> {
    if (this.situationsEntities.getValue() !== null) {
      return this.situationsEntities.asObservable()
    } else {
      return this.retrieveSituations()
    }
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

  reset() {
    this.situationsEntities.next(null)
  }
}
