/**
 * Moodle API utils
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { HttpClient } from '@angular/common/http'

import { throwError, Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
// nnkitodo[FILE]
export class MoodleApiUtils {
  static getServiceName(): string {
    return 'cveteval_app_service'
  }

  static apiCall(
    functionName: string,
    args: any,
    http: HttpClient,
    baseURL: string
  ): Observable<any> {
    const formData: FormData = new FormData()
    formData.append('moodlewssettingfilter', 'true')
    formData.append('moodlewssettingfileurl', 'true')
    formData.append('wsfunction', functionName)
    MoodleApiUtils.convertArguments(formData, null, args)
    return http
      .post(baseURL, formData, {
        params: {
          moodlewsrestformat: 'json',
        },
      })
      .pipe(
        catchError((err) => {
          console.error(err)
          return throwError(err)
        })
      )
  }

  static convertArguments(formData, argumentName, value) {
    if (Array.isArray(value)) {
      value.forEach((itemValue, index) => {
        MoodleApiUtils.convertArguments(
          formData,
          `${argumentName}[${index}]`,
          itemValue
        )
      })
    } else if (value instanceof Object) {
      for (const prop in value) {
        if (typeof value[prop] !== 'undefined') {
          const propName = argumentName ? `${argumentName}[${prop}]` : prop
          const propValue = value[prop]
          MoodleApiUtils.convertArguments(formData, propName, propValue)
        }
      }
    } else {
      formData.append(argumentName, value)
    }
  }
}
