class UserPage {
  wrapper = () => cy.get('[data-cy=user-page]');

  avatar = {
    self: () => cy.get('[data-cy=avatar]'),
    edit: () => cy.get('[data-cy=avatar-update-cta]'),
    addPhoto: () => cy.get('[data-cy=add-photo]'),
    save: () => cy.get('[data-cy=save-avatar]'),
    errorBox: () => cy.get('[data-cy=errors]'),
  }

  hostProfile = {
    self: () => cy.get('[data-cy=host-profile]')
  }

  hostProfileProgressBar = {
    self: () => cy.get('[data-cy=host-profile-progress-bar]')
  }

  reviewsSection = {
    self: () => cy.get('[data-cy=reviews]')
  }


  username = () => cy.get('[data-cy=username]');
  location = () => cy.get('[data-cy=location]');
  createHostProfileCta = () => cy.get('[data-cy=create-host-profile-cta]');

  settingsSection = {
    self: () => cy.get('[data-cy=settings-section]'),
    email: () => this.settingsSection.self().find('[data-cy=email]'),
    location: () => this.settingsSection.self().find('[data-cy=location]'),
    password: () => this.settingsSection.self().find('[data-cy=password]'),
    notifications: () => this.settingsSection.self().find('[data-cy=notifications]'),
    languagePref: () => this.settingsSection.self().find('[data-cy=language-pref]'),
    locationChangeLink: () => this.settingsSection.location().find('#editLocationForm'),
    passwordChangeLink: () => this.settingsSection.password().find('#editPasswordForm'),
    notificationsChangeLink: () => this.settingsSection.notifications().find('#editNotificationsForm'),
    langPrefChangeLink: () => this.settingsSection.languagePref().find('#editLangPrefForm'),
    locationUpdateForm: () => this.settingsSection.self().find('[data-cy=location-update-form]'),
    locationDropdown: () => this.settingsSection.locationUpdateForm().find('[data-cy=location-dropdown]'),
    locationOption: (opt) => cy.get(`[data-cy=location-option-${opt}]`),
    locationSubmit: () => this.settingsSection.locationUpdateForm().find('[data-cy=submit]')
  }
}

module.exports = new UserPage();
