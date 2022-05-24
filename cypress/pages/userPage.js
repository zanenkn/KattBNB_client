class UserPage {
  wrapper = () => cy.get('[data-cy=user-page]');

  avatar = {
    self: () => cy.get('[data-cy=avatar]'),
    edit: () => cy.get('[data-cy=avatar-update-cta]'),
    addPhoto: () => cy.get('[data-cy=add-photo]'),
    save: () => cy.get('[data-cy=save-avatar]'),
    errorBox: () => cy.get('[data-cy=errors]'),
  };

  hostProfile = {
    self: () => cy.get('[data-cy=host-profile]'),
    description: () => cy.get('[data-cy=description]'),
    rate: () => cy.get('[data-cy=rate]'),
    supplement: () => cy.get('[data-cy=supplement]'),
    maxCats: () => cy.get('[data-cy=max-cats]'),
    address: () => cy.get('[data-cy=address]'),
    availability: () => cy.get('[data-cy=availability]'),
    availabilityDate: (date) => this.hostProfile.self().find(`[aria-label$="${date}"]`)
  };

  hostProfileProgressBar = {
    self: () => cy.get('[data-cy=host-profile-progress-bar]'),
    getStep: (step) => this.hostProfileProgressBar.self().find(`[data-cy=step-${step}]`),
    cta: () => this.hostProfileProgressBar.self().find('[data-cy=progress-bar-cta]'),
  };

  reviewsSection = {
    self: () => cy.get('[data-cy=reviews]'),
  };

  username = () => cy.get('[data-cy=username]');
  location = () => cy.get('[data-cy=location]');
  createHostProfileCta = () => cy.get('[data-cy=create-host-profile-cta]');

  settingsSection = {
    self: () => cy.get('[data-cy=settings-section]'),
    email: () => this.settingsSection.self().find('[data-cy=email]'),

    location: () => this.settingsSection.self().find('[data-cy=location]'),
    locationChangeLink: () => this.settingsSection.location().find('#editLocationForm'),
    locationUpdateForm: () => this.settingsSection.self().find('[data-cy=location-update-form]'),
    locationDropdown: () => this.settingsSection.locationUpdateForm().find('[data-cy=location-dropdown]'),
    locationOption: (opt) => cy.get(`[data-cy=location-option-${opt}]`),
    locationSubmit: () => this.settingsSection.locationUpdateForm().find('[data-cy=submit]'),

    password: () => this.settingsSection.self().find('[data-cy=password]'),
    passwordChangeLink: () => this.settingsSection.password().find('#editPasswordForm'),
    passwordUpdateForm: () => this.settingsSection.self().find('[data-cy=password-update-form]'),
    currentPassword: () => this.settingsSection.passwordUpdateForm().find('[data-cy=current-password]'),
    newPassword: () => this.settingsSection.passwordUpdateForm().find('[data-cy=new-password]'),
    passwordConfirmation: () => this.settingsSection.passwordUpdateForm().find('[data-cy=password-confirmation]'),
    passwordSubmit: () => this.settingsSection.passwordUpdateForm().find('[data-cy=submit]'),
    paswordErrors: () => this.settingsSection.passwordUpdateForm().find('[data-cy=errors]'),

    notifications: () => this.settingsSection.self().find('[data-cy=notifications]'),
    notificationsChangeLink: () => this.settingsSection.notifications().find('#editNotificationsForm'),
    notificationsUpdateForm: () => this.settingsSection.self().find('[data-cy=notification-update-form]'),
    notificationsToggle: () => this.settingsSection.notificationsUpdateForm().find('[data-cy=toggle]'),
    notificationsSubmit: () => this.settingsSection.notificationsUpdateForm().find('[data-cy=submit]'),

    languagePref: () => this.settingsSection.self().find('[data-cy=language-pref]'),
    langPrefChangeLink: () => this.settingsSection.languagePref().find('#editLangPrefForm'),
    langPrefUpdateForm: () => this.settingsSection.self().find('[data-cy=language-pref-update-form]'),
    langPrefOption: (option) => this.settingsSection.langPrefUpdateForm().find(`[data-cy=${option}]`),
    langPrefSubmit: () => this.settingsSection.langPrefUpdateForm().find('[data-cy=submit]'),
  };
}

module.exports = new UserPage();
