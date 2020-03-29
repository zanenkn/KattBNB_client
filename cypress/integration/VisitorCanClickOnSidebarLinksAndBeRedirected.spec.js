describe('Visitor can click on sidebar links and be redirected depending on chosen language', () => {
  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000/')
    cy.get('.hamburger-box').click()
  })

  it('to ENG Login page', () => {
    cy.get('#login').click()
    cy.contains('Log in')
  })

  it('to ENG Sign Up page', () => {
    cy.get('#login').click()
    cy.get('#create-account').click()
    cy.contains('Sign up')
  })

  it('to ENG About Us page', () => {
    cy.get('#about').click()
    cy.contains('About us')
  })

  it('to ENG Legal page', () => {
    cy.get('#legal').click()
    cy.contains('Legal')
  })

  it('to ENG FAQ page', () => {
    cy.get('#faq').click()
    cy.contains('FAQ')
  })

  it('to ENG Contact Us page', () => {
    cy.get('#contact').click()
    cy.contains('Contact us')
  })

  it('to SE Login page', () => {
    cy.get('#se').click()
    cy.get('.hamburger-box').click()
    cy.get('#login').click()
    cy.contains('Logga in')
  })

  it('to SE Sign Up page', () => {
    cy.get('#se').click()
    cy.get('.hamburger-box').click()
    cy.get('#login').click()
    cy.get('#create-account').click()
    cy.contains('Registrera dig')
  })

  it('to SE About Us page', () => {
    cy.get('#se').click()
    cy.get('.hamburger-box').click()
    cy.get('#about').click()
    cy.contains('Om oss')
  })

  it('to SE Legal page', () => {
    cy.get('#se').click()
    cy.get('.hamburger-box').click()
    cy.get('#legal').click()
    cy.contains('Policy')
  })

  it('to SE FAQ page', () => {
    cy.get('#se').click()
    cy.get('.hamburger-box').click()
    cy.get('#faq').click()
    cy.contains('Frågor och svar')
  })

  it('to SE Contact Us page', () => {
    cy.get('#se').click()
    cy.get('.hamburger-box').click()
    cy.get('#contact').click()
    cy.contains('Kontakta oss')
  })
})
