Cypress.Commands.add('login', (fixture = {}, email, password, status) => {
  cy.route({
    method: 'POST',
    url: 'http://localhost:3007/api/v1/auth/sign_in',
    status: status,
    response: fixture,
    headers: {
      'uid': email,
    }
  })
  cy.visit('http://localhost:3000')
  cy.get('.hamburger-box').click()
  cy.get('#login').click()
  cy.get('#login-form').within(() => {
    cy.get('#email').type(email)
    cy.get('#password').type(password)
  })
  cy.get('.submit-button').click()
})
