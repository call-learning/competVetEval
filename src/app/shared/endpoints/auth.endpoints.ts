import { environment } from 'src/environments/environment'

export class AuthEndpoints {
  static login = `${environment.apiUrl}/login/token.php`
}
