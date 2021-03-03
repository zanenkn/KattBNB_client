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
  it('and gets an error message if Terms & Conditions are not accepted', () => {
    cy.visit('http://localhost:3000');
    cy.get('.hamburger-box').click();
    cy.get('#login').click();
    cy.get('#create-account').click();
    cy.get('#signup-form').within(() => {
      let text = [
        ['#email', 'george@'],
        ['#password', 'pass'],
        ['#passwordConfirmation', 'passd'],
        ['#nickname', 'KittenPrincess'],
      ];
      text.forEach((element) => {
        cy.get(element[0]).type(element[1]);
      });
    });
    cy.get('#sign-up-button').click();
    cy.contains('You must accept the Terms and Conditions to continue!');
  });

  it('and gets error message if captcha is invalid', () => {
    cy.get('.fitted > label').click();
    cy.get('#sign-up-button').click();
    cy.contains("You didn't input the captcha phrase correctly, please try again!");
  });

  it('and gets various error messages from API', () => {
    signupPostRequest(422, 'fixture:unsuccessful_signup.json');
    cy.get('#cypress-captcha').then((span) => {
      const cap = span.text();
      cy.get('#userCaptcha').type(cap);
    });
    cy.get('#sign-up-button').click();
    cy.contains("Password confirmation doesn't match Password");
    cy.contains('Password is too short (minimum is 6 characters)');
    cy.contains('Email is not an email');
    cy.contains("Location can't be blank");
  });

  it('successfully', () => {
    signupPostRequest(200, 'fixture:successful_signup.json');
    cy.get('#signup-form').within(() => {
      let text = [
        ['#email', 'zane@mail.com'],
        ['#password', 'Am@zing-pass'],
        ['#passwordConfirmation', 'Am@zing-pass'],
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
    cy.contains('Almost done!');
  });
});
