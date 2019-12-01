import stubLanguages from '../support/stubLanguages'

describe('User can view the website', () => {
  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000/')
  })

  it('in Swedish by default', () => {
    cy.get('h1').should('contain', 'KattBNB kommer snart!')
  })

  it('and toggle English as a UI language', () => {
    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
    cy.get('#en').click()
    cy.get('h1').should('contain', 'KattBNB is coming soon!')
  })
})