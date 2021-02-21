import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { BehaviorSubject, throwError } from 'rxjs'
import { AuthService } from './auth.service'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { Criterion } from '../../shared/models/criterion.model'

@Injectable({
  providedIn: 'root',
})
export class CriteriaService {
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService
  ) {
    // Retrieve situations from localStorage if any ?
  }

  criteria = new BehaviorSubject<Criterion[]>([])

  get getCriteria(): Criterion[] {
    return this.criteria.getValue()
  }

  retrieveCriteria() {
    return this.moodleApiService.getCriteria().pipe(
      map((criteria: Criterion[]) => {
        this.criteria.next(criteria)
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }

  public getLabelForCriteria(critid) {
    this.criteria.getValue()
  }
}
