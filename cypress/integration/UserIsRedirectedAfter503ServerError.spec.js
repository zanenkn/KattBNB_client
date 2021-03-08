describe('User is redirected after 503 server error', () => {
  it('succesfully', () => {
    cy.server();
    cy.login('', 'george@mail.com', 'password', 503);
    cy.contains('Hello cat lovers!').should('exist');
  });

  it('unsuccessfuly cause you cannot navigate manually to the path', () => {
    cy.visit('http://localhost:3000/is-not-available');
    cy.contains('Welcome to KattBNB!').should('exist');
  });
});
