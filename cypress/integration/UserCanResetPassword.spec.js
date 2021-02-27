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

function passwordReset(status, response) {
  cy.route({
    method: 'POST',
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
    passwordReset(200, successful_password_reset);
    typeEmail(email);
    cy.contains('Successful password reset request!');
    cy.visit(`${url.client}/change-password`);
    typePasswords('new_password', 'new_password');
    cy.contains('Log in');
  });

  it('unsuccessfully - no email present in the database', () => {
    passwordReset(404, failed_password_reset);
    typeEmail('georgethegreek@mail.com');
    cy.contains(`Unable to find user with email ${email}.`);
  });

  it('unsuccessfully - errors while typing new password', () => {
    cy.visit(`${url.client}/change-password`);
    typePasswords('new', 'new_password');
    cy.contains(
      'Check that both fields are an exact match with each other and that they consist of at least 6 characters'
    );
  });
});
