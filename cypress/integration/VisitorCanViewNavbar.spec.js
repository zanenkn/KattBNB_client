describe('Visitor can view navbar', () => {
  it('and see hamburger menu', () => {
    cy.visit('http://localhost:3000/');
    cy.get('.hamburger-box').should('be.visible');
  });

  it('and see 4 navigational icons', () => {
    cy.get('.twelve').children().should('have.length', 4);
  });
});
