import { AuthService } from 'src/app/core/services/auth.service'
import { Injectable, Injector } from '@angular/core'
import { SchoolsProviderService } from '../providers/schools-provider.service'
import { concatMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  constructor(private injector: Injector) {}

  load(): Promise<boolean> {
    const authService = this.injector.get(AuthService)
    const schoolsProvider = this.injector.get(SchoolsProviderService)

    return new Promise((resolve, reject) => {
      schoolsProvider
        .loadSchools()
        .pipe(
          concatMap(() => {
            return authService.recoverSession()
          })
        )
        .subscribe(
          () => resolve(true),
          () => resolve(true)
        )
    })
  }
}
