class Login {
  passwordResetLink = () => cy.get('[data-cy=password-reset-link]');
  error = () => cy.get('[data-cy=login-errors]');
  createAccountLink = () => cy.get('[data-cy=create-account]');
  loginForm = () => cy.get('[data-cy=login-form]');
}

module.exports = new Login();
