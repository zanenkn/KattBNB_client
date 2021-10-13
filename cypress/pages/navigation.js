class Navigation {
  userAvatar = () => cy.get('[data-cy=user-avatar]');
  visitorAvatar = () => cy.get('[data-cy=visitor-avatar]');
  landing = () => cy.visit('http://localhost:3000');

  to = {
    login: () => cy.get('[data-cy=nav-login]').click({ force: true }),
    logout: () => cy.get('[data-cy=nav-logout]').click({ force: true }),
  };
}

module.exports = new Navigation();
