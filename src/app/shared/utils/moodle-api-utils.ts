import { ServerEndpoints } from 'src/app/shared/endpoints/server.endpoints'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export class MoodleApiUtils {
  static apiCall(
    functionName: string,
    args: Object,
    http: HttpClient
  ): Observable<any> {
    const formData: FormData = new FormData()
    formData.append('moodlewssettingfilter', 'true')
    formData.append('moodlewssettingfileurl', 'true')
    formData.append('wsfunction', functionName)
    for (let prop in args) {
      formData.append(prop, args[prop])
    }
    return http.post(ServerEndpoints.server(), formData, {
      params: {
        moodlewsrestformat: 'json',
      },
    })
  }
}
