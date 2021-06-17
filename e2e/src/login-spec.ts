import { server } from '../../src/mock/server'
import { AppPage } from './pages/app-page.po'
import { LoginPage } from './pages/login-page.po'

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
  const page: LoginPage = new LoginPage()
  const app = new AppPage()
  beforeEach(() => {
    app.load()
  })
  it('should be blank', () => {
    page.load()
    expect(page.getTitle()).toContain('CompetVetEval')
  })
})
