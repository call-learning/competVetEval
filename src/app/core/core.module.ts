/**
 * Core modules
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { CommonModule } from '@angular/common'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { APP_INITIALIZER, NgModule } from '@angular/core'

import { AngularSvgIconModule } from 'angular-svg-icon'
import { AddTokenInterceptor } from './interceptors/add-token.interceptor'
import { FormatRequestInterceptor } from './interceptors/format-request.interceptor'
import { StartupService } from './services/startup.service'

function initApplication(startupService: StartupService) {
  return () => startupService.load()
}
@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, AngularSvgIconModule.forRoot()],
  providers: [
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApplication,
      multi: true,
      deps: [StartupService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FormatRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
