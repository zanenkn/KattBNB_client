class UserPage {
  wrapper = () => cy.get('[data-cy=user-page]');
  avatar = () => cy.get('[data-cy=avatar]');
  username = () => cy.get('[data-cy=username]');
  location = () => cy.get('[data-cy=location]');
  createHostProfileCta = () => cy.get('[data-cy=create-host-profile-cta]');
  settingsSection = () => cy.get('[data-cy=settings-section]');
}

module.exports = new UserPage();
