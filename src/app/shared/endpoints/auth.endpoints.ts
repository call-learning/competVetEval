import { SchoolsProviderService } from '../../core/providers/schools-provider.service'

export class AuthEndpoints {
  static login() {
    return `${SchoolsProviderService.getSelectedSchoolUrl()}/login/token.php`
  }
}
