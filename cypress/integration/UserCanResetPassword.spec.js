const email = 'george@mail.com';
const successful_password_reset = {
  success: true,
  message: `An email has been sent to ${email} containing instructions for resetting your password.`,
};
const url = {
  api_pass: 'http://localhost:3007/api/v1/auth/password',
  client: 'http://localhost:3000',
};

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
    cy.route({
      method: 'POST',
      url: `${url.api_pass}`,
      status: 200,
      response: successful_password_reset,
    });
    cy.get('#email').type(email);
    cy.get('#reset-pass-button').click();
    cy.contains('Successful password reset request!');
    cy.visit(`${url.client}/change-password`);
    cy.get('#password').type('new_password');
    cy.get('#passwordConfirmation').type('new_password');
    cy.get('#change-pass-button').click();
    cy.contains('Log in');
  });

  it('unsuccessfully - no email present in the database', () => {
    cy.route({
      method: 'POST',
      url: `${url.api_pass}`,
      status: 404,
      response: {
        success: false,
        errors: [`Unable to find user with email ${email}.`],
      },
    });
    cy.get('#email').type('georgethegreek@mail.com');
    cy.get('#reset-pass-button').click();
    cy.contains(`Unable to find user with email ${email}.`);
  });

  it('unsuccessfully - errors while typing new password', () => {
    cy.route({
      method: 'POST',
      url: `${url.api_pass}`,
      status: 200,
      response: successful_password_reset,
    });
    cy.get('#email').type(email);
    cy.get('#reset-pass-button').click();
    cy.contains('Successful password reset request!');
    cy.visit(`${url.client}/change-password`);
    cy.get('#password').type('new');
    cy.get('#passwordConfirmation').type('new_password');
    cy.get('#change-pass-button').click();
    cy.contains(
      'Check that both fields are an exact match with each other and that they consist of at least 6 characters'
    );
  });
});
