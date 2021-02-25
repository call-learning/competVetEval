import { Injectable } from '@angular/core'

import { School } from 'src/app/shared/models/school.model'
import { environment } from 'src/environments/environment'
import { LocaleKeys } from '../../shared/utils/locale-keys'

@Injectable({
  providedIn: 'root',
})
export class SchoolsProviderService {
  constructor() {}

  static getSchoolsList(): School[] {
    const prodschool = [
      {
        id: 'enva',
        name: 'EnvA',
        logo: 'assets/images/schools/logo-enva.png',
        moodleUrl: 'https://eve.vet-alfort.fr/',
      },
      {
        id: 'oniris',
        name: 'Oniris',
        logo: 'assets/images/schools/logo-oniris.png',
        moodleUrl: 'https://connect.oniris-nantes.fr/',
      },
      {
        id: 'envt',
        name: 'envt',
        logo: 'assets/images/schools/logo-envt.png',
        moodleUrl: 'https://moodle.envt.fr/',
      },
      {
        id: 'vet-agro-sup',
        name: 'VetAgro Sup',
        logo: 'assets/images/schools/logo-vetagro.png',
        moodleUrl: 'https://vetagrotice.vetagro-sup.fr/',
      },
    ]
    const devschool = [
      {
        id: 'dev-instance',
        name: 'Development Instance',
        logo: 'assets/images/schools/logo-calllearning.png',
        moodleUrl: 'https://cveteval.call-learning.fr',
      },
      {
        id: 'local-instance',
        name: 'Local development Instance',
        logo: 'assets/images/schools/logo-calllearning-local.png',
        moodleUrl: 'http://competveteval.local/',
      },
    ]
    return environment.production ? prodschool : prodschool.concat(devschool)
  }

  static getSchoolFromId(id: string) {
    return SchoolsProviderService.getSchoolsList().find((school) => {
      return school.id === id
    })
  }

  static getSelectedSchoolUrl() {
    const schoolId = localStorage.getItem(LocaleKeys.schoolChoiceId)
    const currentSchool = SchoolsProviderService.getSchoolFromId(schoolId)
    if (currentSchool) {
      return currentSchool.moodleUrl
    }
    return SchoolsProviderService.getSchoolsList()[0].moodleUrl
  }
}
