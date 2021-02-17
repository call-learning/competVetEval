import { Injectable } from '@angular/core'
import { Situation } from 'src/app/shared/models/situation.model'

@Injectable({
  providedIn: 'root',
})
export class SituationService {
  getSituationsForUser(userid): Situation[] {
    return [
      {
        id: 1,
        title: 'Chirurgie technique',
        startTime: 1613581447,
        endTime: 1594757687,
        type: 'student',
        evaluationsRequired: 4,
        evaluationsCompleted: 3,
        comments: '1',
        status: 'done',
      },
      {
        id: 1,
        title: 'Chirurgie technique',
        startTime: 1613581447,
        endTime: 1614186247,
        type: 'student',
        evaluationsRequired: 4,
        evaluationsCompleted: 3,
        comments: '1',
        status: 'in_progress',
      },
      {
        id: 1,
        title: 'Chirurgie technique',
        startTime: 1613581447,
        endTime: 1614186247,
        type: 'student',
        evaluationsRequired: 4,
        evaluationsCompleted: 3,
        comments: '1',
        status: 'todo',
      },
    ]
  }
}
