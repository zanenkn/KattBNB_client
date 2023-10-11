describe.skip('Visitor can view menu', () => {
  it('and can toggle visibility by clicking on the hamburger', () => {
    cy.visit('http://localhost:3000/');
    cy.get('.hamburger-box').click();
    cy.get('#menu').should('be.visible');
    cy.get('.hamburger-box').click();
    cy.get('#menu').should('not.be.visible');
  });

  it('and can see links to different homepage sections in ENG', () => {
    let links = ['Log in', 'Sign up', 'About us', 'Terms & conditions', 'FAQ', 'Contact us'];
    cy.get('.hamburger-box').click();
    links.forEach((link) => {
      cy.contains(link).should('exist');
    });
  });

  it('and can see links to different homepage sections in SE', () => {
    let links = ['Logga in', 'Registrera', 'Om oss', 'Frågor och svar', 'Kontakta oss', 'Användarvillkor'];
    cy.get('#se').click();
    cy.get('.hamburger-box').click();
    links.forEach((link) => {
      cy.contains(link).should('exist');
    });
  });

  it('and can toggle menu visibility off by clicking outside the menu', () => {
    cy.get('#menu').should('be.visible');
    cy.get('[width="100px"] > [fill="#C90B61"]').click({ force: true });
    cy.get('#menu').should('not.be.visible');
  });
});
