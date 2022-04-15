class UserPage {
  wrapper = () => cy.get('[data-cy=user-page]');
  avatar = {
    self: () => cy.get('[data-cy=avatar]'),
    edit: () => cy.get('[data-cy=avatar-update-cta]'),
    addPhoto: () => cy.get('[data-cy=add-photo]'),
    save: () => cy.get('[data-cy=save-avatar]'),
    errorBox: () => cy.get('[data-cy=errors]'),
  }


  username = () => cy.get('[data-cy=username]');
  location = () => cy.get('[data-cy=location]');
  createHostProfileCta = () => cy.get('[data-cy=create-host-profile-cta]');
  settingsSection = () => cy.get('[data-cy=settings-section]');
}

module.exports = new UserPage();
