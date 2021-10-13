class Login {
  error = () => cy.get('[data-cy=login-errors]');

}

module.exports = new Login();