import { CommonModule } from '@angular/common'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormatRequestInterceptor } from './interceptors/format-request.interceptor'
import { UseSchoolUrlInterceptor } from './interceptors/use-school-url.interceptor'

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FormatRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UseSchoolUrlInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
