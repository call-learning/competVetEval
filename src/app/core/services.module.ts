/**
 * Service Module
 *
 * All base service modules
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { NgModule } from '@angular/core'

import { HttpAuthService } from './http-services/http-auth.service'
import { MoodleApiService } from './http-services/moodle-api.service'
import { SchoolsProviderService } from './providers/schools-provider.service'
import { AuthService } from './services/auth.service'
import { BaseDataService } from './services/base-data.service'
import { EnvironmentService } from './services/environment.service'

@NgModule({
  declarations: [],
  providers: [
    AuthService,
    BaseDataService,
    MoodleApiService,
    HttpAuthService,
    SchoolsProviderService,
    EnvironmentService,
  ],
})
export class ServicesModule {}
