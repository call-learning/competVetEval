import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { BehaviorSubject, throwError } from 'rxjs'
import { AuthService } from './auth.service'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { EvalGrid } from '../../shared/models/eval-grid.model'

@Injectable({
  providedIn: 'root',
})
export class EvalGridService {
  constructor(
    private moodleApiService: MoodleApiService,
    private authService: AuthService
  ) {
    // Retrieve situations from localStorage if any ?
  }

  evalGrids = new BehaviorSubject<EvalGrid[]>([])

  get getEvalGrids(): EvalGrid[] {
    return this.evalGrids.getValue()
  }

  retrieveEvalGrids() {
    return this.moodleApiService.getEvalGrids().pipe(
      map((evalgrids: EvalGrid[]) => {
        this.evalGrids.next(evalgrids)
      }),
      catchError((err) => {
        console.error(err)
        return throwError(err)
      })
    )
  }
}
