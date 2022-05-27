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
    availabilityDate: (date) => this.hostProfile.self().find(`[aria-label$="${date}"]`),
    change: (section) => this.hostProfile[section]().find('[data-cy=change]').click({ force: true }),
    updateWrapper: (section) => this.hostProfile.self().find(`[data-cy=${section}-update-form]`),
    new: (section, text) => this.hostProfile.updateWrapper(section).find('[data-cy=new]').clear().type(text),
    clearField: (section) => this.hostProfile.updateWrapper(section).find('[data-cy=new]').clear(),
    submitUpdated: (section) => this.hostProfile.updateWrapper(section).find('[data-cy=submit]').click(),
    closeUpdateForm: (section) => this.hostProfile.updateWrapper(section).find('[data-cy=close]').click(),
    error: (section) => this.hostProfile.updateWrapper(section).find('[data-cy=error]'),
  };

  hostProfileProgressBar = {
    self: () => cy.get('[data-cy=host-profile-progress-bar]'),
    getStep: (step) => this.hostProfileProgressBar.self().find(`[data-cy=step-${step}]`),
    cta: () => this.hostProfileProgressBar.self().find('[data-cy=progress-bar-cta]'),
  };

  reviewsSection = {
    self: () => cy.get('[data-cy=reviews]'),
    count: () => cy.get('[data-cy=review-count]'),
    score: () => cy.get('[data-cy=average-score]').find('[data-cy=score]'),
    wrapper: () => cy.get('[id=all-reviews]'),
    review: (id) => {
      return {
        self: () => this.reviewsSection.self().find(`[data-cy=${id}]`),
        avatar: () => this.reviewsSection.review(id).self().find('[data-cy=reviewer-avatar]'),
        name: () => this.reviewsSection.review(id).self().find('[data-cy=reviewer-name]'),
        date: () => this.reviewsSection.review(id).self().find('[data-cy=date]'),
        score: () => this.reviewsSection.review(id).self().find('[data-cy=score]'),
        body: () => this.reviewsSection.review(id).self().find('[data-cy=review-body]'),
        reply: () => this.reviewsSection.review(id).self().find('[data-cy=reply]'),
        replyForm: () => this.reviewsSection.review(id).self().find('[data-cy=reply-form]'),
        replierAvatar: () => this.reviewsSection.review(id).reply().find('[data-cy=reply-avatar]'),
        replierName: () => this.reviewsSection.review(id).reply().find('[data-cy=reply-name]'),
        replyDate: () => this.reviewsSection.review(id).reply().find('[data-cy=reply-date]'),
        replyBody: () => this.reviewsSection.review(id).reply().find('[data-cy=reply-body]'),
        replyCTA: () => this.reviewsSection.review(id).replyForm().find('[data-cy=reply-cta]'),
        replyInput: () => this.reviewsSection.review(id).replyForm().find('[data-cy=host-reply]'),
        replyErrors: () => this.reviewsSection.review(id).replyForm().find('[data-cy=errors]'),
        submitReply: () => this.reviewsSection.review(id).replyForm().find('[data-cy=submit]').click(),
      };
    },
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
