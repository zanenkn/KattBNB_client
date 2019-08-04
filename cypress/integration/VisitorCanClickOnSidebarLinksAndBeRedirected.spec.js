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
    cy.contains('LOGIN PAGE')
  })

  it('to Sign Up page', () => {
    cy.get('#signup').click()
    cy.contains('SIGN UP PAGE')
  })

  it('to About Us page', () => {
    cy.get('#about').click()
    cy.contains('ABOUT US')
  })

  it('to Legal page', () => {
    cy.get('#legal').click()
    cy.contains('LEGAL PAGE')
  })

  it('to FAQ page', () => {
    cy.get('#faq').click()
    cy.contains('FAQ PAGE')
  })

  it('to Contact Us page', () => {
    cy.get('#contact').click()
    cy.contains('CONTACT US PAGE')
  })

  it('to Blog page', () => {
    cy.get('#blog').click()
    cy.contains('BLOG PAGE')
  })
})
