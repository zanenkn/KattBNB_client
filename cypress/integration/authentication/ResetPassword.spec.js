const email = 'george@mail.com';
const successful_password_reset = {
  success: true,
  message: `An email has been sent to ${email} containing instructions for resetting your password.`,
};
const failed_password_reset = {
  success: false,
  errors: [`Unable to find user with email ${email}.`],
};
const url = {
  api_pass: 'http://localhost:3007/api/v1/auth/password',
  client: 'http://localhost:3000',
};

function passwordReset(method, status, response) {
  cy.route({
    method: method,
    url: `${url.api_pass}`,
    status: status,
    response: response,
  });
}

function typePasswords(password, pass_confirmation) {
  cy.get('#password').type(password);
  cy.get('#passwordConfirmation').type(pass_confirmation);
  cy.get('#change-pass-button').click();
}

function typeEmail(email_address) {
  cy.get('#email').type(email_address);
  cy.get('#reset-pass-button').click();
}

describe('User can reset password', () => {
  beforeEach(() => {
    cy.server();
    cy.visit(`${url.client}`);
    cy.get('.hamburger-box').click();
    cy.get('#login').click();
    cy.get('#login-form').within(() => {
      cy.get('#password-reset-link').click();
    });
  });

  it('successfully', () => {
    passwordReset('POST', 200, successful_password_reset);
    passwordReset('PUT', 200, successful_password_reset);
    typeEmail(email);
    cy.contains('Successful password reset request!').should('exist');
    cy.visit(
      `${url.client}/change-password?uid=kasgdh@mail.com&access-token=ansbhfdghje5754d5rfe545&katiallo=cdmhfshruj54fg54r5ft4r&katiallo=cdmhfshruj54fg54r5ft4r&katiallo=cdmhfshruj54fg54r5ft4r`
    );
    typePasswords('new_pAssword1', 'new_pAssword1');
    cy.contains('You have succesfully changed your password! Please wait to be redirected.').should('exist');
    cy.contains('Log in').should('exist');
  });

  it('unsuccessfully - no email present in the database', () => {
    passwordReset('POST', 404, failed_password_reset);
    typeEmail('georgethegreek@mail.com');
    cy.contains(`Unable to find user with email ${email}.`).should('exist');
  });

  it('unsuccessfully - errors while typing new password', () => {
    cy.visit(`${url.client}/change-password`);
    typePasswords('new', 'new_password');
    cy.contains(
      'Check that both fields are an exact match with each other, they are between 6 to 20 characters and contain at least one numeric digit, one uppercase and one lowercase letter!'
    ).should('exist');
  });

  it('unsuccessfully - visits page with invalid params', () => {
    cy.visit(`${url.client}/change-password`);
    typePasswords('new_passworD1', 'new_passworD1');
    cy.contains("You should first visit the login page and click on the 'Forgot your password?' link").should('exist');
  });
});
