import nav from '../../pages/navigation';
import login from '../../pages/login';
import userPage from '../../pages/userPage';
import mockAPI from '../../support/api';
import assert from '../../support/assertions';

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
      userUpdate: 'mySettings/user_update.json',
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
      hostProfile: 'hostProfile/individual.json',
      tokenValidation: 'validate_token.json',
      userUpdate: 'mySettings/user_update.json',
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
      successfulPasswordChange: true,
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();

    userPage.settingsSection.passwordChangeLink().click();
    userPage.settingsSection.currentPassword().type('password', { force: true });
    userPage.settingsSection.newPassword().type('SeCuReP@SsWoRd1', { force: true });
    userPage.settingsSection.passwordConfirmation().type('SeCuReP@SsWoRd1', { force: true });
    userPage.settingsSection.passwordSubmit().click();
    assert.alert('Your password was successfully changed!');
    login.loginForm().should('exist');
  });

  it('user can not change their password if current password is incorrect', () => {
    mockAPI.userPage({
      unsuccessfulPasswordChange: true,
      tokenValidation: 'validate_token.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();

    userPage.settingsSection.passwordChangeLink().click();
    userPage.settingsSection.currentPassword().type('wrongpassword', { force: true });
    userPage.settingsSection.newPassword().type('SeCuReP@SsWoRd1', { force: true });
    userPage.settingsSection.passwordConfirmation().type('SeCuReP@SsWoRd1', { force: true });
    userPage.settingsSection.passwordSubmit().click();
    userPage.settingsSection.paswordErrors().should('exist').and('have.text', 'Current password is invalid');
  });

  it('user can not change their password if current password is left empty', () => {
    mockAPI.userPage();

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();

    userPage.settingsSection.passwordChangeLink().click();
    userPage.settingsSection.newPassword().type('SeCuReP@SsWoRd1', { force: true });
    userPage.settingsSection.passwordConfirmation().type('SeCuReP@SsWoRd1', { force: true });
    userPage.settingsSection.passwordSubmit().click();
    userPage.settingsSection.paswordErrors().should('exist').and('have.text', 'Please enter your current password');
  });

  it('user can not change their password if new password is not compliant with password rules', () => {
    mockAPI.userPage();

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();

    userPage.settingsSection.passwordChangeLink().click();
    userPage.settingsSection.currentPassword().type('password', { force: true });
    userPage.settingsSection.newPassword().type('pass', { force: true });
    userPage.settingsSection.passwordConfirmation().type('pass', { force: true });
    userPage.settingsSection.passwordSubmit().click();
    userPage.settingsSection
      .paswordErrors()
      .should('exist')
      .and(
        'have.text',
        'Your new password must be between 6 to 20 characters and contain at least one numeric digit, one uppercase and one lowercase letter!'
      );
  });

  it('user can not change their password if new password does not match confirmation', () => {
    mockAPI.userPage();

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();

    userPage.settingsSection.passwordChangeLink().click();
    userPage.settingsSection.currentPassword().type('password', { force: true });
    userPage.settingsSection.newPassword().type('SeCuReP@SsWoRd1', { force: true });
    userPage.settingsSection.passwordConfirmation().type('SomethingEntirelyElse', { force: true });
    userPage.settingsSection.passwordSubmit().click();
    userPage.settingsSection
      .paswordErrors()
      .should('exist')
      .and('have.text', 'The new password and new password confirmation fields does not match, please re-type!');
  });

  it('user can change their notification settings', () => {
    mockAPI.userPage({
      userUpdate: 'mySettings/user_update.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.settingsSection.notificationsChangeLink().click();
    userPage.settingsSection.notificationsToggle().click();
    userPage.settingsSection.notificationsSubmit().click();
    assert.alert('Message notification settings updated!');
  });

  it('user can change their email language preference', () => {
    mockAPI.userPage({
      userUpdate: 'mySettings/user_update.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.settingsSection.langPrefChangeLink().click();
    userPage.settingsSection.langPrefOption('en').click();
    userPage.settingsSection.langPrefSubmit().click();
    assert.alert('Email language settings updated!');
  });
});
