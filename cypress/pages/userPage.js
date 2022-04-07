class UserPage {
  wrapper = () => cy.get('[data-cy=user-page]');
}

module.exports = new UserPage();
