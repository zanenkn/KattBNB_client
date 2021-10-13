class Login {
  error = () => cy.get('[data-cy=login-errors]');
  createAccountLink = () => cy.get('[data-cy=create-account]')
}

module.exports = new Login();