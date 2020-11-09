import { Injectable } from '@angular/core'

import { School } from 'src/app/shared/models/school.model'

@Injectable({
  providedIn: 'root',
})
export class SchoolsProviderService {
  constructor() {}

  getSchoolsList(): School[] {
    return [
      {
        id: 'enva',
        name: 'EnvA',
        logo: 'assets/images/schools/logo-enva.png',
        moodleUrl: 'https://cveteval.call-learning.fr',
      },
      {
        id: 'oniris',
        name: 'Oniris',
        logo: 'assets/images/schools/logo-oniris.png',
        moodleUrl: 'https://cveteval.call-learning.fr',
      },
      {
        id: 'envt',
        name: 'envt',
        logo: 'assets/images/schools/logo-envt.png',
        moodleUrl: 'https://cveteval.call-learning.fr',
      },
      {
        id: 'vet-agro-sup',
        name: 'VetAgro Sup',
        logo: 'assets/images/schools/logo-vetagro.png',
        moodleUrl: 'https://cveteval.call-learning.fr',
      },
    ]
  }

  getSchoolFromId(id: string) {
    return this.getSchoolsList().find((school) => {
      return school.id === id
    })
  }
}
