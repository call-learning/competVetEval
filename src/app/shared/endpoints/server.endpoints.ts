/**
 * Server enpoint management
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { SchoolsProviderService } from '../../core/providers/schools-provider.service'

export class ServerEndpoints {
  constructor(private schoolsProviderService: SchoolsProviderService) {}

  server() {
    return `${this.schoolsProviderService.getSelectedSchoolUrl()}/webservice/rest/server.php`
  }
}
