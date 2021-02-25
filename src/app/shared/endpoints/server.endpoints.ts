import { SchoolsProviderService } from '../../core/providers/schools-provider.service'

export class ServerEndpoints {
  static server() {
    return `${SchoolsProviderService.getSelectedSchoolUrl()}/webservice/rest/server.php`
  }
}
