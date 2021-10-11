import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export class SituationsFilters {
  status: 'today' | 'all'
  title: string
  withoutObservations: boolean
  observationsNumber: {
    lower: number
    upper: number
  }
  sortBy:
    | 'startTimeASC'
    | 'startTimeDESC'
    | 'endTimeASC'
    | 'endTimeDESC'
    | 'observationsASC'
    | 'observationssDESC'
}

@Injectable({
  providedIn: 'root',
})
export class SituationsFiltersService {
  situationsFilter$: BehaviorSubject<SituationsFilters>

  constructor() {
    this.situationsFilter$ = new BehaviorSubject({
      status: 'today',
      title: '',
      withoutObservations: false,
      observationsNumber: {
        lower: 0,
        upper: 10,
      },
      sortBy: 'endTimeDESC',
    })
  }
}
