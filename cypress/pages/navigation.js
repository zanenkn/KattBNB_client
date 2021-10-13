class Navigation {
  userAvatar = () => cy.get('[data-cy=user-avatar]');
  visitorAvatar = () => cy.get('[data-cy=visitor-avatar]');
  goTo = {
    logout: () => cy.get('[data-cy=nav-logout]').click({force: true})
  }
}

module.exports = new Navigation();