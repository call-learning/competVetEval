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

import { HttpBackend, HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { uniqBy } from 'lodash'
import { iif, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { School } from 'src/app/shared/models/school.model'
import { LocaleKeys } from '../../shared/utils/locale-keys'
import { EnvironmentService } from '../services/environment.service'

@Injectable({
  providedIn: 'root',
})
export class SchoolsProviderService {
  public schoolsList: School[] = null

  constructor(
    private environment: EnvironmentService,
    private handler: HttpBackend
  ) {}

  loadSchools() {
    return iif(
      () => !!this.environment.schoolConfigUrl,
      this.getSchoolsFromHttp(),
      of(this.environment.schools)
    ).pipe(
      tap((schools) => {
        this.schoolsList = schools
      })
    )
  }

  getSchoolsFromHttp() {
    const httpClient = new HttpClient(this.handler)
    return httpClient.get<School[]>(this.environment.schoolConfigUrl).pipe(
      map((schoolList) => {
        return uniqBy(
          [...schoolList, ...this.environment.schools],
          (school) => {
            return school.id
          }
        )
      }),
      catchError((err) => {
        console.error(
          `Cannot fetch school information: (${err.name}:${err.message})`
        )
        return of(this.environment.schools)
      })
    )
  }

  /**
   * Retrieve school definition from its id (short identifier)
   *
   * @param id
   */
  getSchoolFromId(id: string) {
    if (id) {
      return this.schoolsList.find((school) => {
        return school.id === id
      })
    } else {
      return null
    }
  }

  /**
   * Get currently selected school or null
   */
  getSelectedSchoolId(): string | null {
    return localStorage.getItem(LocaleKeys.schoolChoiceId)
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
  setSelectedSchoolId(id: string | null) {
    if (id === 'null' || id === null) {
      localStorage.removeItem(LocaleKeys.schoolChoiceId)
    } else {
      localStorage.setItem(LocaleKeys.schoolChoiceId, id)
    }
  }
}
