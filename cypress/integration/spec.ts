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
    cy.contains("Sélection de l'école")
    cy.get('.card > img').click()
    cy.get('form ion-input[formcontrolname=username] > input').click()
    cy.get('form ion-input[formcontrolname=username] > input').type('student1')
    cy.get('form ion-input[formcontrolname=password] > input').click()
    cy.get('form ion-input[formcontrolname=password] > input').type('password')
    cy.get('.btn.item-connect').click()
    cy.get('ion-segment-button[value=all]').click()
    cy.get('.list-item:nth-child(2)').click()
    cy.get('.nnki-mb4').click()
    cy.get('.native-textarea').click()
    cy.get('.native-textarea').type('Demander obs')
    cy.get('.btn:nth-child(3)').click()
    cy.get('.form:nth-child(1)').submit()
    cy.get('.ion-activated').click()
    cy.get('.button-has-icon-only').click()
    cy.get(
      '.list-item:nth-child(7) .list-item-content .list-item-content > div'
    ).click()
    cy.get('.ion-margin-vertical > .list-md:nth-child(1)').click()
    cy.get('.md:nth-child(1) > .list-item .item').click()
    cy.get('.list-item:nth-child(1) .list-item-infos').click()
  })
})
