/**
 * Locale Key utils
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

export class LocaleKeys {
  static schoolChoiceId = 'CVE_AUTH-school-choice'
  static tokenId = 'CVE_AUTH-access-token'
  static authProfile = 'CVE_AUTH-user-profile'

  static rememberMePassword = 'CVE_PWD_rememberMe_password'
  static rememberMeUsername = 'CVE_PWD_rememberMe_username'

  static criteria = 'CVE_DATA-criteria'

  static cleanupAllLocalStorage() {
    LocaleKeys.cleanupAuthStorage()
    localStorage.removeItem(LocaleKeys.schoolChoiceId)
    localStorage.removeItem(LocaleKeys.rememberMePassword)
    localStorage.removeItem(LocaleKeys.rememberMeUsername)
  }
  static cleanupAuthStorage() {
    localStorage.removeItem(LocaleKeys.tokenId)
    localStorage.removeItem(LocaleKeys.authProfile)
  }
}
