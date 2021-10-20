const failed_password_reset = {
  success: false,
  errors: [`Unable to find user with email george@mail.com.`],
};

import login from '../../pages/login';
import nav from '../../pages/navigation';
import passwordReset from '../../pages/passwordReset';
import { api, client } from '../../support/constants';

describe('User can reset password', () => {
  beforeEach(() => {
    cy.server();
    nav.landing();
    nav.to.login();
    login.passwordResetLink().click();
  });

  it.only('successfully', () => {
    cy.intercept('POST', `${api}/auth/password`, {
      statusCode: 200,
      body: {
        success: true,
        message: `An email has been sent to george@mail.com containing instructions for resetting your password.`,
      },
    });

    cy.intercept('PUT', `${api}/auth/password`, {
      statusCode: 200,
      body: {
        success: true,
        message: `An email has been sent to george@mail.com containing instructions for resetting your password.`,
      },
    });

    passwordReset.emailField().type('george@mail.com');
    passwordReset.submitButton().click();

    cy.location('pathname').should('eq', '/password-reset-success');

    cy.visit(
      `${client}/change-password?uid=kasgdh@mail.com&access-token=ansbhfdghje5754d5rfe545&katiallo=cdmhfshruj54fg54r5ft4r&katiallo=cdmhfshruj54fg54r5ft4r&katiallo=cdmhfshruj54fg54r5ft4r`
    );

    passwordReset.passwordField().type('new_pAssword1');
    passwordReset.passwordConfirmationField().type('new_pAssword1');
    passwordReset.changePasswordButton().click();

    passwordReset
      .successNotice()
      .should('have.text', 'You have succesfully changed your password! Please wait to be redirected.');

    cy.location('pathname').should('eq', '/login');
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
