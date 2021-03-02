describe('Visitor can sign up', () => {
  it('and gets an error message if Terms & Conditions are not accepted', () => {
    cy.visit('http://localhost:3000');
    cy.get('.hamburger-box').click();
    cy.get('#login').click();
    cy.get('#create-account').click();
    cy.get('#signup-form').within(() => {
      let text = [
        ['#email', 'zane@mail'],
        ['#password', 'pass'],
        ['#passwordConfirmation', 'pass'],
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

  it('successfully', () => {
    cy.get('#sign-up-button').click();
    cy.visit('http://localhost:3000/signup-success');
    cy.contains('Almost done!');
  });
});
