describe('User can reset password', () => {
  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000')
  })

  it('successfully', () => {
    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
    cy.get('#login').click()
    cy.get('#login-form').within(() => {
      cy.get('#password-reset').click()
    })
    cy.get('#user-email').type('george@mail.com')
    cy.get('#reset-button').click()
    cy.contains('follow instructions something. blindly.')
    cy.visit('http://localhost:3000/change-password')
    cy.get('#new-password').type('new_password')
    cy.get('#new-password-confirmation').type('new_password')
    cy.get('#change-password').click()
    cy.contains('Log in')
  })
})