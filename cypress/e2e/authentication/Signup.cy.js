import nav from '../../pages/navigation';
import login from '../../pages/login';
import signup from '../../pages/signup';

const api = 'http://localhost:3007/api/v1';

function signupPostRequest(status, response) {
  cy.intercept('POST', `${api}/auth`, {
    statusCode: status,
    fixture: response,
  });
}

describe('Signup', () => {
  context('unsuccessful', () => {
    beforeEach(() => {
      nav.landing();
      nav.to.login();
      login.createAccountLink().click();
    });

    it('with error: Terms & Conditions are not accepted', () => {
      signup.fields.email().type('george@mail.com');
      signup.fields.password().type('passWORD');
      signup.fields.passwordConfirmation().type('passWORD');
      signup.fields.nickname().type('KittenPrincess');
      signup.submit().click();

      signup.errors().should('exist').and('include.text', 'You must accept the Terms and Conditions to continue!');
    });

    it('with error: captcha invalid', () => {
      signup.fields.email().type('george@mail.com');
      signup.fields.password().type('passWORD');
      signup.fields.passwordConfirmation().type('passWORD');
      signup.fields.nickname().type('KittenPrincess');
      signup.fields.captcha().type('abc123');
      signup.fields.tncToggle().click();
      signup.submit().click();

      signup
        .errors()
        .should('exist')
        .and('include.text', "You didn't input the captcha phrase correctly, please try again!");
    });

    it('with error: invalid password', () => {
      signup.fields.email().type('george@mail.com');
      signup.fields.password().type('passWORD');
      signup.fields.passwordConfirmation().type('passWORD');
      signup.fields.nickname().type('KittenPrincess');
      signup.fields.location().click();
      signup.fields.locationOption('Alvesta').click();
      signup.fillCaptcha();
      signup.fields.tncToggle().click();
      signup.submit().click();

      signup
        .errors()
        .should('exist')
        .and(
          'include.text',
          'Password must be between 6 to 20 characters and must contain at least one numeric digit, one uppercase and one lowercase letter!'
        );
    });

    it('with backend error: non matching password', () => {
      signupPostRequest(422, 'signup/unsuccessful_no_match_password.json');
      signup.fields.email().type('george@mail.com');
      signup.fields.password().type('passWORD1');
      signup.fields.passwordConfirmation().type('somethingElse2');
      signup.fields.nickname().type('KittenPrincess');
      signup.fields.location().click();
      signup.fields.locationOption('Alvesta').click();
      signup.fillCaptcha();
      signup.fields.tncToggle().click();
      signup.submit().click();

      signup.errors().should('exist').and('include.text', "Password confirmation doesn't match Password");
    });

    it('with backend error: invalid email', () => {
      signupPostRequest(422, 'signup/unsuccessful_invalid_email.json');
      signup.fields.email().type('george@mail');
      signup.fields.password().type('passWORD1');
      signup.fields.passwordConfirmation().type('passWORD1');
      signup.fields.nickname().type('KittenPrincess');
      signup.fields.location().click();
      signup.fields.locationOption('Alvesta').click();
      signup.fillCaptcha();
      signup.fields.tncToggle().click();
      signup.submit().click();

      signup.errors().should('exist').and('include.text', 'Email is not an email');
    });

    it('with backend error: no location', () => {
      signupPostRequest(422, 'signup/unsuccessful_no_location.json');
      signup.fields.email().type('george@mail.com');
      signup.fields.password().type('passWORD1');
      signup.fields.passwordConfirmation().type('passWORD1');
      signup.fields.nickname().type('KittenPrincess');
      signup.fillCaptcha();
      signup.fields.tncToggle().click();
      signup.submit().click();

      signup.errors().should('exist').and('include.text', "Location can't be blank");
    });

    it('with backend error: no email', () => {
      signupPostRequest(422, 'signup/unsuccessful_no_email.json');
      signup.fields.password().type('passWORD1');
      signup.fields.passwordConfirmation().type('passWORD1');
      signup.fields.nickname().type('KittenPrincess');
      signup.fields.location().click();
      signup.fields.locationOption('Alvesta').click();
      signup.fillCaptcha();
      signup.fields.tncToggle().click();
      signup.submit().click();

      signup.errors().should('exist').and('include.text', "Email can't be blank");
    });

    it('with backend error: no nickname', () => {
      signupPostRequest(422, 'signup/unsuccessful_no_nickname.json');
      signup.fields.email().type('george@mail.com');
      signup.fields.password().type('passWORD1');
      signup.fields.passwordConfirmation().type('passWORD1');
      signup.fields.location().click();
      signup.fields.locationOption('Alvesta').click();
      signup.fillCaptcha();
      signup.fields.tncToggle().click();
      signup.submit().click();

      signup.errors().should('exist').and('include.text', "Nickname can't be blank");
    });
  });

  context('succesful', () => {
    it('no errors', () => {
      nav.landing();
      nav.to.signup();
      signupPostRequest(200, 'signup/successful.json');
      signup.fields.email().type('zane@mail.com');
      signup.fields.password().type('passWORD1');
      signup.fields.passwordConfirmation().type('passWORD1');
      signup.fields.nickname().type('KittenPrincess');
      signup.fields.location().click();
      signup.fields.locationOption('Alvesta').click();
      signup.fillCaptcha();
      signup.fields.tncToggle().click();
      signup.submit().click();

      cy.location('pathname').should('eq', '/signup-success');
    });
  });
});
