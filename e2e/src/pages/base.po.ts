import { browser, by, element, ExpectedConditions } from 'protractor'

export class PageObjectBase {
  private path: string
  protected tag: string

  constructor(tag: string, path: string) {
    this.tag = tag
    this.path = path
  }

  load() {
    return browser.get(this.path)
  }

  rootElement() {
    return element(by.css(this.tag))
  }

  waitUntilInvisible() {
    browser.wait(ExpectedConditions.invisibilityOf(this.rootElement()), 3000)
  }

  waitUntilPresent() {
    browser.wait(ExpectedConditions.presenceOf(this.rootElement()), 3000)
  }

  waitUntilNotPresent() {
    browser.wait(
      ExpectedConditions.not(ExpectedConditions.presenceOf(this.rootElement())),
      3000
    )
  }

  waitUntilVisible() {
    browser.wait(ExpectedConditions.visibilityOf(this.rootElement()), 3000)
  }

  getTitle() {
    return element(by.css(`${this.tag} ion-title`)).getText()
  }

  public enterInputText(sel: string, text: string) {
    const el = element(by.css(`${this.tag}${sel}`))
    const inp = el.element(by.css('input'))
    inp.sendKeys(text)
  }

  public enterTextareaText(sel: string, text: string) {
    const el = element(by.css(`${this.tag}${sel}`))
    const inp = el.element(by.css('textarea'))
    inp.sendKeys(text)
  }

  public clickButton(sel: string) {
    const el = element(by.css(`${this.tag}${sel}`))
    browser.wait(ExpectedConditions.elementToBeClickable(el))
    el.click()
  }
}
