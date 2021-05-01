/**
 * API endpoint URL
 *
 *
 * Depends on school choice
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Injectable } from '@angular/core'
import { SchoolsProviderService } from '../providers/schools-provider.service'

@Injectable({
  providedIn: 'root',
})
export class EndpointsServices {
  constructor(private schoolsProviderService: SchoolsProviderService) {}

  server() {
    return `${this.schoolsProviderService.getSelectedSchoolUrl()}/webservice/rest/server.php`
  }

  login() {
    return `${this.schoolsProviderService.getSelectedSchoolUrl()}/login/token.php`
  }
}
