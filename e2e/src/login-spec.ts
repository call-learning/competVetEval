import { server } from '../../src/mock/server'
import { AppPage } from './pages/app-page.po'
import { browser, by, element, ExpectedConditions } from 'protractor'

describe('new App', () => {
  beforeEach(async () => {
    await server.listen()
  })
  afterEach(() => {
    server.resetHandlers()
  })
  afterAll(() => {
    server.close()
  })
  const app = new AppPage()
  beforeEach(() => {})
  // Script created using protractor recorder (https://chrome.google.com/webstore/detail/protractor-recorder/ebfpgeghginolinmdhlbecaahehoijlh).
  it('Expect to have the main title in the login page', () => {
    browser.get('/school-choice')

    const el = element(by.css('#main > app-school-choice > ion-content > a'))
    browser.wait(ExpectedConditions.elementToBeClickable(el))
    el.click()

    element(by.css('label:nth-of-type(1)')).click()
    element(by.css('input[name="ion-input-0"]')).click()
    element(by.css('input[name="ion-input-0"]')).click()
    element(by.css('input[name="ion-input-0"]')).clear()
    element(by.css('input[name="ion-input-0"]')).sendKeys('student1')
    element(by.css('input[name="ion-input-1"]')).clear()
    element(by.css('input[name="ion-input-1"]')).sendKeys('password')
    element(by.css('form>button')).click()
    expect(element(by.css('title')).getText()).toContain('CompetVetEval')
  })
})
