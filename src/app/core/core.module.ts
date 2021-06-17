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
import { NgModule } from '@angular/core'

import { AngularSvgIconModule } from 'angular-svg-icon'
import { AddTokenInterceptor } from './interceptors/add-token.interceptor'
import { FormatRequestInterceptor } from './interceptors/format-request.interceptor'

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, AngularSvgIconModule.forRoot()],
  providers: [
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
