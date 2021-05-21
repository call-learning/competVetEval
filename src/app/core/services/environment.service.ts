/**
 * Environment service
 *
 * Used mainly for tests
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Injectable } from '@angular/core'

import { environment } from 'src/environments/environment'
import { IEnvironment } from '../../../environments/ienvironment'
import { School } from '../../shared/models/school.model'

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService implements IEnvironment {
  mockServer: boolean
  schools: Array<School>
  production: boolean
  helpUrl: string

  constructor() {
    this.schools = environment.schools
    this.production = environment.production
    this.mockServer = environment.mockServer
    this.helpUrl = environment.helpUrl
  }
}
