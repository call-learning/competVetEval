import { LoginPage } from './pages/login-page.po'
import { AppPage } from './pages/app-page.po'
import { server } from '../../src/mock/server'

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
  let page: LoginPage = new LoginPage()
  const app = new AppPage()
  beforeEach(() => {
    app.load()
  })
  it('should be blank', () => {
    page.load()
    expect(page.getTitle()).toContain('CompetVetEval')
  })
})
