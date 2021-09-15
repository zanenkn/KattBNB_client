const email = 'george@mail.com';
const errors = {
  credentials: 'Invalid login credentials. Please try again.',
  confirmation: `A confirmation email was sent to your account at ${email}. 
                You must follow the instructions in the email before your account can be activated`,
};

describe('User can log in and logout', () => {
  beforeEach(() => {
    cy.server();
  });
  context('login', () => {
    it('succesfully', () => {
      cy.login('fixture:successful_login.json', email, 'password', 200);
      cy.get('[data-cy=user-avatar]').should('exist')
      cy.contains('You have succesfully logged in!').should('exist');
    });

    it('unsuccessfuly with invalid credentials', () => {
      cy.login(
        {
          success: false,
          errors: [errors.credentials],
        },
        email,
        'wrongpassword',
        401
      );
      cy.get('[data-cy=user-avatar]').should('not.exist')
      cy.contains('Invalid login credentials. Please try again.').should('exist');
    });

    it('unsuccessfuly cause of unconfirmed email address', () => {
      cy.login(
        {
          success: false,
          errors: [errors.confirmation],
        },
        email,
        'wrongpassword',
        401
      );
      cy.get('[data-cy=user-avatar]').should('not.exist')
      cy.contains(`A confirmation email was sent to your account at ${email}.`).should('exist');
    });
  });

  context('logout', () => {
    it('successfully', () => {
      cy.route({
        method: 'DELETE',
        url: 'http://localhost:3007/api/v1/auth/sign_out',
        status: 200,
        response: 'fixture:successful_signout.json',
      });
      cy.login('fixture:successful_login.json', email, 'password', 200);

      cy.get('[data-cy=log-out]').click({force: true})
      cy.get('[data-cy=user-avatar]').should('not.exist')
      cy.get('[data-cy=visitor-avatar]').should('exist')
    });
  });
});
