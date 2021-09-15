Cypress.Commands.add('login', (fixture = {}, email, password, status) => {
  cy.route({
    method: 'POST',
    url: 'http://localhost:3007/api/v1/auth/sign_in',
    status: status,
    response: fixture,
    headers: {
      uid: email,
    },
  });
  cy.visit('http://localhost:3000');
  cy.get('[data-cy=go-to-login]').click({force: true})
  cy.get('[data-cy=login-form]').within(() => {
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=password]').type(password);
  });
  cy.get('[data-cy=log-in-button]').click();
});
