import { browser, by, element, ExpectedConditions } from 'protractor'
import { PageObjectBase } from './base.po'

export class LoginPage extends PageObjectBase {
  constructor() {
    super('app-login', '/login')
  }

  getErrorMessage() {
    return element(by.css('.error')).getText()
  }

  enterEMail(email: string) {
    this.enterInputText('#email-input', email)
  }

  enterPassword(password: string) {
    this.enterInputText('#password-input', password)
  }

  clickSignIn() {
    this.clickButton('#signin-button')
  }
}
