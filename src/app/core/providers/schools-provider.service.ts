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
import { BehaviorSubject, throwError } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { HttpClient, HttpBackend } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class SchoolsProviderService {
  public schoolList$ = new BehaviorSubject<School[]>(null)
  // Specific HTTP Client without any injector.
  private httpClient: HttpClient

  constructor(private environment: EnvironmentService, handler: HttpBackend) {
    if (this.environment.schoolConfigUrl) {
      const httpClient = new HttpClient(handler)
      httpClient
        .get<School[]>(this.environment.schoolConfigUrl)
        .pipe(
          map((schoolList) => {
            // Add school, and override it if needed.
            const allSchool = [...this.environment.schools, ...schoolList]
            return allSchool.reduce((uniqueSchools, item) => {
              const hasItemIndex = uniqueSchools.findIndex(
                (el) => el.id === item.id
              )
              if (hasItemIndex !== -1) {
                uniqueSchools[hasItemIndex] = item
              } else {
                uniqueSchools.push(item)
              }
              return uniqueSchools
            }, [])
          }),
          catchError((err) => {
            console.log(
              `Cannot fetch school information: (${err.name}:${err.message})`
            )
            return this.environment.schools
          }),
          tap((schoolList: School[]) => {
            this.schoolList$.next(schoolList)
            this.schoolList$.complete()
          })
        )
        .subscribe()
    } else {
      this.schoolList$.next(this.environment.schools)
      this.schoolList$.complete()
    }
  }

  /**
   * Retrieve school definition from its id (short identifier)
   *
   * @param id
   */
  getSchoolFromId(id: string) {
    const currentList = this.schoolList$.getValue()
    if (id && currentList) {
      return this.schoolList$.getValue().find((school) => {
        return school.id === id
      })
    } else {
      return null
    }
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
    if (id === 'null' || id === null) {
      localStorage.removeItem(LocaleKeys.schoolChoiceId)
    } else {
      localStorage.setItem(LocaleKeys.schoolChoiceId, id)
    }
  }
}
