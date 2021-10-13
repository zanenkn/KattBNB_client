import nav from '../../pages/navigation';
import login from '../../pages/login';
import signup from '../../pages/signup';

const api = 'http://localhost:3007/api/v1';

function signupPostRequest(status, response) {
  cy.server();
  cy.route({
    method: 'POST',
    url: `${api}/auth`,
    status: status,
    response: response,
  });
}

describe('Visitor can sign up', () => {
  beforeEach(() => {
    nav.landing();
    nav.to.login();
    login.createAccountLink().click();
  });

  it('and gets an error message if Terms & Conditions are not accepted', () => {
    signup.fields.email().type('george@');
    signup.fields.password().type('passWORD');
    signup.fields.passwordConfirmation().type('passWORD');
    signup.fields.nickname().type('KittenPrincess');
    signup.submit().click();

    signup.errors().should('exist').and('include.text', 'You must accept the Terms and Conditions to continue!');
  });

  it('and gets error message if captcha is invalid', () => {
    signup.fields.email().type('george@');
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

  it('and gets error message cause password is invalid', () => {

    signup.fields.email().type('george@');
    signup.fields.password().type('passWORD');
    signup.fields.passwordConfirmation().type('passWORD');
    signup.fields.nickname().type('KittenPrincess');
    signup.fillCaptcha()
    signup.fields.tncToggle().click();
    signup.submit().click();

    signup
      .errors()
      .should('exist')
      .and('include.text', "Password must be between 6 to 20 characters and must contain at least one numeric digit, one uppercase and one lowercase letter!");
  });

  it('and gets various error messages from API', () => {
    signupPostRequest(422, 'fixture:unsuccessful_signup.json');
    let text = [
      ['#password', 'Am@zing-paSS1'],
      ['#passwordConfirmation', 'Am@zing-paSs1'],
    ];
    text.forEach((element) => {
      cy.get(element[0]).clear().type(element[1]);
    });
    cy.get('#sign-up-button').click();
    cy.contains("Password confirmation doesn't match Password").should('exist');
    cy.contains('Email is not an email').should('exist');
    cy.contains("Location can't be blank").should('exist');
  });

  it('successfully', () => {
    signupPostRequest(200, 'fixture:successful_signup.json');
    cy.get('#signup-form').within(() => {
      let text = [
        ['#email', 'zane@mail.com'],
        ['#password', 'Am@zing-pass12'],
        ['#passwordConfirmation', 'Am@zing-pass12'],
        ['#nickname', 'KittenPrincess'],
      ];
      text.forEach((element) => {
        cy.get(element[0]).clear().type(element[1]);
      });
    });
    cy.get('.dropdown:nth-child(3)').click();
    cy.get('.item:nth-child(2)').click();
    cy.get('#sign-up-button').click();
    cy.location('pathname').should('eq', '/signup-success');
    cy.contains('Almost done!').should('exist');
  });
});
