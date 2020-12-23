describe('Visitor can view navbar', () => {
  beforeEach(function () {
    cy.server();
    cy.visit('http://localhost:3000/');
  });

  it('and see hamburger menu', () => {
    cy.get('.hamburger-box').should('be.visible');
  });

  it('and see 4 navigational icons', () => {
    cy.get('.twelve').children().should('have.length', 4);
  });
});
