import { worker } from '../../src/mock/browser'

describe('My First Test', () => {
  beforeEach(async () => {
    await worker.start()
  })
  after(() => {
    worker.stop()
  })
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Welcome')
    cy.contains('sandbox app is running!')
  })
})
