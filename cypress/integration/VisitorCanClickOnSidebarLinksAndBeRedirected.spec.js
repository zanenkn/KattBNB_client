describe('Visitor can click on sidebar links and be redirected', () => {
  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000/')
    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
  })

  it('to Login page', () => {
    cy.get('#login').click()
    cy.contains('Log in')
  })

  it('to Sign Up page', () => {
    cy.get('#signup').click()
    cy.contains('Sign up')
  })

  it('to About Us page', () => {
    cy.get('#about').click()
    cy.contains('About us')
  })

  it('to Legal page', () => {
    cy.get('#legal').click()
    cy.contains('Legal')
  })

  it('to FAQ page', () => {
    cy.get('#faq').click()
    cy.contains('FAQ')
  })

  it('to Contact Us page', () => {
    cy.get('#contact').click()
    cy.contains('Contact us')
  })
})
