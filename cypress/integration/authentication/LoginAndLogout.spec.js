import nav from '../../pages/navigation';
import login from '../../pages/login';

const errors = {
  credentials: 'Invalid login credentials. Please try again.',
  confirmation: 'A confirmation email was sent to your account at george@mail.com. You must follow the instructions in the email before your account can be activated',
};

describe('Login and logout', () => {
  beforeEach(() => {
    cy.server();
  });

  context('login', () => {
    it('succesfully', () => {
      cy.login('login/successful.json', 'george@mail.com', 'password', 200);
      nav.userAvatar().should('exist');
    });

    it('unsuccessfuly with invalid credentials', () => {
      cy.login('login/unsuccesful_invalid_credentials.json', 'george@mail.com', 'wrongpassword', 401);
      nav.userAvatar().should('not.exist');
      login.error().should('exist').and('have.text', errors.credentials);
    });

    it('unsuccessfuly cause of unconfirmed email address', () => {
      cy.login('login/unsuccessful_unconfirmed_email.json', 'george@mail.com', 'wrongpassword', 401);
      nav.userAvatar().should('not.exist');
      login.error().should('exist').and('have.text', errors.confirmation);
    });
  });

  context('logout', () => {
    it('successfully', () => {
      cy.intercept('DELETE', 'http://localhost:3007/api/v1/auth/sign_out', {
        statusCode: 200,
        body: 'fixture:successful_signout.json',
      });

      cy.login('login/successful.json', 'george@mail.com', 'password', 200);
      nav.to.logout();
      nav.userAvatar().should('not.exist');
      nav.visitorAvatar().should('exist');
    });
  });
});
