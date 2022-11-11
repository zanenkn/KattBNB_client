const api = 'http://localhost:3007/api/v1';

function APICall(url, status, response) {
  cy.server();
  cy.route({
    method: 'GET',
    url: url,
    status: status,
    response: response,
  });
}

describe('Visitor can send a message via the Contact Us form', () => {
  before(function () {
    cy.visit('http://localhost:3000');
    cy.get('.hamburger-box').click();
    cy.get('#contact').click();
  });

  it('unsuccessfully cause not all fields are filled in', () => {
    cy.get('.submit-button').click();
    cy.contains('You must fill out all fields!').should('exist');
  });

  it('unsuccessfully cause message exceeds the 1000 character limit', () => {
    cy.get('#name').type('George');
    cy.get('#email').type('george@mail.com');
    cy.get('#message').type(
      'Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king! Rails is king!'
    );
    cy.get('.submit-button').click();
    cy.contains('Your message cannot exceed 1000 characters!').should('exist');
  });

  it('unsuccessfully cause captca is incorrect', () => {
    cy.get('#message').clear().type('Rails is king!');
    cy.get('.submit-button').click();
    cy.contains("You didn't input the captcha phrase correctly, please try again!").should('exist');
  });

  it('unsuccessfully cause email in invalid', () => {
    APICall(`${api}/contactus?locale=en-US&name=George&email=george@&message=Rails is king!`, 422, {
      error: [
        "There was a problem validating your email! Are you sure it's the right one? You can always find us by following our social media links below.",
      ],
    });
    cy.get('#email').clear().type('george@');
    cy.get('#cypress-captcha').then((span) => {
      const cap = span.text();
      cy.get('#userCaptcha').type(cap);
    });
    cy.get('.submit-button').click();
    cy.contains(
      "There was a problem validating your email! Are you sure it's the right one? You can always find us by following our social media links below."
    ).should('exist');
  });

  it('successfully', () => {
    APICall(`${api}/contactus?locale=en-US&name=George&email=george@gmail.com&message=Rails is king!`, 200, {});
    cy.get('#email').clear().type('george@gmail.com');
    cy.get('.submit-button').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Your message was submitted successfully! We will meow back a response :)');
    });
    cy.location('pathname').should('eq', '/search');
  });
});
