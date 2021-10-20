class PasswordReset {
  emailField = () => cy.get('[data-cy=email]');
  submitButton = () => cy.get('[data-cy=reset-pass-button]');
  passwordField = () => cy.get('[data-cy=password]');
  passwordConfirmationField = () => cy.get('[data-cy=password-confirmation]');
  changePasswordButton = () => cy.get('[data-cy=change-pass-button]');
  successNotice = () => cy.get('[data-cy=success-notice]');
  errorNotice = () => cy.get('[data-cy=error-notice]');
}

module.exports = new PasswordReset();
