import { HttpClient } from '@angular/common/http'

import { Observable } from 'rxjs'
import { ServerEndpoints } from 'src/app/shared/endpoints/server.endpoints'

export class MoodleApiUtils {
  static apiCall(
    functionName: string,
    args: any,
    http: HttpClient
  ): Observable<any> {
    const formData: FormData = new FormData()
    formData.append('moodlewssettingfilter', 'true')
    formData.append('moodlewssettingfileurl', 'true')
    formData.append('wsfunction', functionName)
    MoodleApiUtils.convertArguments(formData, null, args)
    return http.post(ServerEndpoints.server(), formData, {
      params: {
        moodlewsrestformat: 'json',
      },
    })
  }

  protected static convertArguments(formData, argumentName, value) {
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
        if (value[prop]) {
          const propName = argumentName ? `${argumentName}[${prop}]` : prop
          MoodleApiUtils.convertArguments(formData, propName, value[prop])
        }
      }
    } else {
      formData.append(argumentName, value)
    }
  }
}
