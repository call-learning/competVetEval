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
  private situationsEntities = new BehaviorSubject<Situation[]>(null)

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
          const allAppraisals = appraisals.filter(
            (a) => a.situationId === sit.id
          )
          sit.appraisalsCompleted = allAppraisals.length
          sit.status =
            sit.appraisalsRequired - sit.appraisalsCompleted > 0
              ? sit.appraisalsCompleted
                ? 'in_progress'
                : 'todo'
              : 'done'
          let numberCriteria = 0
          let score = 0
          const recurseAppraisalScore = (criteria) => {
            criteria.forEach((criteria) => {
              if (criteria.grade) {
                score += criteria.grade
                numberCriteria++
              }
              if (criteria.subcriteria) {
                recurseAppraisalScore(criteria.subcriteria)
              }
            })
          }
          allAppraisals.forEach((appraisal) => {
            recurseAppraisalScore(appraisal.criteria)
          })

          sit.appraisalAverage =
            numberCriteria == 0 ? 0 : Math.floor(score / numberCriteria)

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
