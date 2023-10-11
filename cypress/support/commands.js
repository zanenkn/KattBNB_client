import 'cypress-file-upload';

Cypress.Commands.add('login', (response = {}, email, password, status, nav = true) => {
  cy.intercept('POST', 'http://localhost:3007/api/v1/auth/sign_in', {
    statusCode: status,
    fixture: response,
    headers: {
      uid: email,
    },
  });
  if (nav) {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=nav-login]').click({ force: true });
  }
  cy.get('[data-cy=login-form]').within(() => {
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=password]').type(password);
  });
  cy.get('[data-cy=log-in-button]').click();
});

Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(100, 100);
});
