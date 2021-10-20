class Login {
  passwordResetLink = () => cy.get('[data-cy=password-reset-link]');
  error = () => cy.get('[data-cy=login-errors]');
  createAccountLink = () => cy.get('[data-cy=create-account]');
}

module.exports = new Login();
