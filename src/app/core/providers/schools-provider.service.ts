/**
 * School provider URL management
 *
 * Manage entities for connexion
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Injectable } from '@angular/core'

import { School } from 'src/app/shared/models/school.model'
import { LocaleKeys } from '../../shared/utils/locale-keys'
import { EnvironmentService } from '../services/environment.service'

@Injectable({
  providedIn: 'root',
})
export class SchoolsProviderService {
  constructor(private environment: EnvironmentService) {}

  /**
   * Get all school list
   * @return School[] a list of schools to connect to
   */
  getSchoolsList(): Array<School> {
    return this.environment.schools
  }

  /**
   * Retrieve school definition from its id (short identifier)
   *
   * @param id
   */
  getSchoolFromId(id: string) {
    return this.getSchoolsList().find((school) => {
      return school.id === id
    })
  }

  /**
   * Get URL from the currently selected school
   */
  getSelectedSchoolUrl() {
    const schoolId = this.getSelectedSchoolId()

    const currentSchool = this.getSchoolFromId(schoolId)
    if (currentSchool) {
      return currentSchool.moodleUrl
    }
    throw new Error(`Ecole ${schoolId} non trouvée parmi la liste des écoles`)
  }

  /**
   * Get currently selected school or null
   */
  getSelectedSchoolId(): string | null {
    return localStorage.getItem(LocaleKeys.schoolChoiceId)
  }

  /**
   * Get currently selected school or null
   */
  setSelectedSchoolId(id: string | null) {
    localStorage.setItem(LocaleKeys.schoolChoiceId, id)
  }
}
