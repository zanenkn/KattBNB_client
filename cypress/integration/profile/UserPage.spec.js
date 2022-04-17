import { api } from '../../support/constants';
import nav from '../../pages/navigation';
import login from '../../pages/login';
import userPage from '../../pages/userPage';
import mockAPI from '../../support/api';
import assert from '../../support/assertions';

describe('User tries to view profile page', () => {
  it('without logging in', () => {
    nav.userPage();
    userPage.wrapper().should('not.exist');
    login.loginForm().should('exist');
  });
});

describe('User views profile page when logged in', () => {
  it('has no host profile', () => {
    mockAPI.userPage();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.wrapper().should('exist');
    userPage.avatar.self().should('exist');
    userPage.username().should('exist').and('contain.text', 'GeorgeTheGreek');
    userPage.location().should('exist').and('contain.text', 'Stockholm');
    userPage.settingsSection.self().should('exist');
    userPage.createHostProfileCta().should('exist');
  });

  it('has host profile', () => {
    mockAPI.userPage({ hostProfile: 'host_profile_individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.wrapper().should('exist');
    userPage.avatar.self().should('exist');
    userPage.username().should('exist').and('contain.text', 'GeorgeTheGreek');
    userPage.location().should('exist').and('contain.text', 'Stockholm');
    userPage.settingsSection.self().should('exist');
    userPage.hostProfile.self().should('exist');
    userPage.hostProfileProgressBar.self().should('exist');
    userPage.reviewsSection.self().should('exist');
  });
});

describe('User can change the avatar', () => {
  it('successfully', () => {
    mockAPI.userPage({
      tokenValidation: 'validate_token.json',
      avatarChange: true,
    });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.avatar.edit().click();
    userPage.avatar.addPhoto().attachFile('good-picture.png');
    userPage.avatar.save().click();
    userPage.avatar.errorBox().should('not.exist');
  });

  it('unsuccessfully - wrong file format', () => {
    mockAPI.userPage();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.avatar.edit().click();
    userPage.avatar.addPhoto().attachFile('wrong-format-picture.svg');
    userPage.avatar.save().click();
    userPage.avatar.errorBox().should('exist').and('include.text', 'Please select a JPG, JPEG, PNG or GIF image file!');
  });
});

describe('My settings', () => {
  it('user can view their settings', () => {
    mockAPI.userPage();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.settingsSection.self().should('exist');
    userPage.settingsSection.email().should('exist').and('include.text', 'george@mail.com');
    userPage.settingsSection.location().should('exist').and('include.text', 'Stockholm');
    userPage.settingsSection.locationChangeLink().should('exist');
    userPage.settingsSection.password().should('exist').and('include.text', '******');
    userPage.settingsSection.passwordChangeLink().should('exist');
    userPage.settingsSection.notifications().should('exist').and('include.text', 'Notification settings');
    userPage.settingsSection.notificationsChangeLink().should('exist');
    userPage.settingsSection.languagePref().should('exist').and('include.text', 'Email language');
    userPage.settingsSection.langPrefChangeLink().should('exist');
  });

  it('user can change their location - no host profile', () => {
    mockAPI.userPage({
      tokenValidation: 'validate_token.json',
      locationChange: 'successful_location_change.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();

    userPage.settingsSection.locationChangeLink().click();
    userPage.settingsSection.locationDropdown().click({ force: true });
    userPage.settingsSection.locationOption('Vaxholm').click();
    userPage.settingsSection.locationSubmit().click();
    assert.alert('Location succesfully changed!');
  });

  it('user can change their location - host profile address mismatch', () => {
    mockAPI.userPage({
      hostProfile: 'host_profile_individual.json',
      tokenValidation: 'validate_token.json',
      locationChange: 'successful_location_change.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();

    userPage.settingsSection.locationChangeLink().click();
    userPage.settingsSection.locationDropdown().click({ force: true });
    userPage.settingsSection.locationOption('Vaxholm').click();
    userPage.settingsSection.locationSubmit().click();
    assert.confirm(
      'It seems that the location you selected does not match your host profile address. Are you sure you want to continue?'
    );
    assert.alert('Location succesfully changed!');
  });

  it('user can change their password successfully and be redirected to login', () => {
    mockAPI.userPage({
      successfulPasswordChange: 'successful_password_change_user_page.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();

    userPage.settingsSection.passwordChangeLink().click();
    userPage.settingsSection.currentPassword().type('password', { force: true })
    userPage.settingsSection.newPassword().type('SeCuReP@SsWoRd1', { force: true })
    userPage.settingsSection.passwordConfirmation().type('SeCuReP@SsWoRd1', { force: true })
    userPage.settingsSection.passwordSubmit().click()
    assert.alert('Your password was successfully changed!')
    login.loginForm().should('exist');
  });

  it('user can not change their password if current password is incorrect', () => {
    mockAPI.userPage({
      unsuccessfulPasswordChange: 'successful_password_change_user_page.json',
      tokenValidation: 'validate_token.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();

    userPage.settingsSection.passwordChangeLink().click();
    userPage.settingsSection.currentPassword().type('wrongpassword', { force: true })
    userPage.settingsSection.newPassword().type('SeCuReP@SsWoRd1', { force: true })
    userPage.settingsSection.passwordConfirmation().type('SeCuReP@SsWoRd1', { force: true })
    userPage.settingsSection.passwordSubmit().click()

    userPage.settingsSection.paswordErrors().should('exist').and('have.text', 'Current password is invalid')
  });

  it('user can not change their password if current password is left empty', () => {
    mockAPI.userPage();

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();

    userPage.settingsSection.passwordChangeLink().click();
    userPage.settingsSection.newPassword().type('SeCuReP@SsWoRd1', { force: true })
    userPage.settingsSection.passwordConfirmation().type('SeCuReP@SsWoRd1', { force: true })
    userPage.settingsSection.passwordSubmit().click()
    userPage.settingsSection.paswordErrors().should('exist').and('have.text', 'Please enter your current password')
  });
});

describe('User can view their profile page - happy path', () => {
  beforeEach(function () {
    loadUserPageAPICalls();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
  });

  it('and change password successfully', () => {
    deviseAuthPassword(200, 'fixture:successful_password_change_user_page.json');
    cy.get('#editPasswordForm').click();
    cy.get('#currentPassword').type('password');
    cy.get('#newPassword').type('SeCuReP@SsWoRd1');
    cy.get('#newPasswordConfirmation').type('SeCuReP@SsWoRd1', { force: true });
    cy.get('#password-submit-button').click();
    cy.contains('Log in').should('exist');
  });

  it('and change notification settings successfully', () => {
    deviseAuthRoute('PUT', 200, 'fixture:successful_location_change.json');
    cy.get('#editNotificationsForm').click();
    cy.get('.fitted > label').click();
    cy.get('#notifications-submit-button').click();
    checkWindowAlert('Message notification settings updated!');
  });

  it('and change email language preference settings successfully', () => {
    deviseAuthRoute('PUT', 200, 'fixture:successful_location_change.json');
    cy.get('#editLangPrefForm').click();
    cy.get(':nth-child(2) > .ui > label').click();
    cy.get('#email-language-submit-button').click();
    checkWindowAlert('Email language settings updated!');
  });

  it('and deletes their account - no upcoming and request bookings - no host profile exists', () => {
    deviseAuthRoute('DELETE', 200, 'fixture:successful_account_deletion.json');
    getBookingStats('0', '0', '2', '0', '0', '0', '3', '0');
    cy.get('#delete-account-link').click();
    checkWindowConfirm();
    checkWindowAlert('Your account was succesfully deleted!');
    cy.contains('Welcome to KattBNB!').should('exist');
  });

  it('and cannot delete their account cause of upcoming and request bookings', () => {
    getBookingStats('0', '1', '2', '0', '1', '0', '3', '0');
    cy.get('#delete-account-link').click();
    checkWindowAlert('To delete your account, you must not have any pending or unpaid bookings!');
    cy.location('pathname').should('eq', '/user-page');
  });
});

describe('User can view their profile page - sad path', () => {
  before(function () {
    loadUserPageAPICalls();
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.get('#user-icon').click({ force: true });
  });

  it('and does not change location successfully', () => {
    cy.get('#editLocationForm').click();
    cy.get('#location').click();
    cy.get('.ui > #location > .visible > .item:nth-child(5) > .text').click();
    cy.get('#location > .dropdown').click();
    cy.get('#location-submit-button').click();
    cy.contains('No location selected or location is unchanged!').should('exist');
  });

  it('and unsuccessfully tries to change password - invalid new password', () => {
    cy.get('#editPasswordForm').click();
    cy.get('#currentPassword').type('passwordD');
    cy.get('#newPassword').type('SeCuReP@SsWoR');
    cy.get('#newPasswordConfirmation').type('SeCuReP@SsWoRd', { force: true });
    cy.get('#password-submit-button').click();
    cy.contains(
      "Check that 'new password' fields are an exact match with each other, they are between 6 to 20 characters and contain at least one numeric digit, one uppercase and one lowercase letter!"
    ).should('exist');
  });

  it('and unsuccessfully tries to change password - invalid existing password', () => {
    cy.server();
    deviseAuthPassword(422, {
      success: false,
      errors: { current_password: ['is invalid'], full_messages: ['Current password is invalid'] },
    });
    cy.get('#currentPassword').clear().type('passwordD');
    cy.get('#newPassword').clear().type('SeCuReP@SsWoRd1');
    cy.get('#newPasswordConfirmation').clear().type('SeCuReP@SsWoRd1', { force: true });
    cy.get('#password-submit-button').click();
    cy.contains('Current password is invalid').should('exist');
  });

  it('and unsuccessfully tries to change notification settings', () => {
    cy.get('#editNotificationsForm').click();
    cy.get('#notifications-submit-button').click();
    cy.contains('No changes made to your settings!').should('exist');
  });

  it('and unsuccessfully tries to change email language preference settings', () => {
    cy.get('#editLangPrefForm').click();
    cy.get('#email-language-submit-button').click();
    cy.contains('No changes made to your settings!').should('exist');
  });
});

describe('User can view their profile page', () => {
  it('and delete their account - host profile exists - no Stripe errors', () => {
    deleteAccountAPICalls();
    stripeCall(200, { message: 'Success!' });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.get('#user-icon').click({ force: true });
    cy.get('#delete-account-link').click();
    checkWindowConfirm();
    checkWindowAlert('Your account was succesfully deleted!');
    cy.contains('Welcome to KattBNB!').should('exist');
  });
});

describe('User can view their profile page', () => {
  it('and cannot delete their account - host profile exists - Stripe errors', () => {
    deleteAccountAPICalls();
    stripeCall(555, { error: 'No success!' });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.get('#user-icon').click({ force: true });
    cy.get('#delete-account-link').click();
    checkWindowConfirm();
    cy.contains(
      'Make sure your Stripe account balance is 0 and try again. If this error persists, please contact our support staff.'
    ).should('exist');
  });
});
