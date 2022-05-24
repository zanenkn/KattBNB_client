import nav from '../../pages/navigation';
import login from '../../pages/login';
import userPage, { hostProfile } from '../../pages/userPage';
import mockAPI from '../../support/api';
import assert from '../../support/assertions';
import createHostProfile from '../../pages/createHostProfile';

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
    mockAPI.userPage({ hostProfile: 'hostProfile/host_profile_individual.json' });
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
      userUpdate: 'successful_user_update.json',
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
      hostProfile: 'hostProfile/host_profile_individual.json',
      tokenValidation: 'validate_token.json',
      userUpdate: 'successful_user_update.json',
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
    userPage.settingsSection.currentPassword().type('password', { force: true });
    userPage.settingsSection.newPassword().type('SeCuReP@SsWoRd1', { force: true });
    userPage.settingsSection.passwordConfirmation().type('SeCuReP@SsWoRd1', { force: true });
    userPage.settingsSection.passwordSubmit().click();
    assert.alert('Your password was successfully changed!');
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
      userUpdate: 'successful_user_update.json',
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
      userUpdate: 'successful_user_update.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.settingsSection.langPrefChangeLink().click();
    userPage.settingsSection.langPrefOption('en').click();
    userPage.settingsSection.langPrefSubmit().click();
    assert.alert('Email language settings updated!');
  });
});

describe('Cretating host profile', () => {
  it('without logging in', () => {
    nav.createHostProfile();
    login.loginForm().should('exist');
    createHostProfile.wrapper().should('not.exist');
  });
});

describe('Viewing host profile -', () => {
  it('no host profile', () => {
    mockAPI.userPage();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.self().should('not.exist');
    userPage.createHostProfileCta().should('exist');
    userPage.wrapper().should('exist');
  });

  it('host profile exists', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/host_profile_individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.self().should('exist');
    hostProfile.description().should('exist').and('include.text', 'this is a description about me!!!!');
    hostProfile
      .address()
      .should('exist')
      .and('include.text', 'Charles de Gaulle Airport (CDG), 95700 Roissy-en-France, France');
    hostProfile.rate().should('exist').and('include.text', '100 kr/day for 1 cat');
    hostProfile.supplement().should('exist').and('include.text', 'Extra 35 kr/day per cat');
    hostProfile.maxCats().should('exist').and('include.text', 'Maximum cats: 3');
    hostProfile.availability().should('exist');
    const dates = [23, 24, 25];
    dates.forEach((date) => {
      hostProfile.availabilityDate(`Sep ${date}, 2019`).should('have.attr', 'aria-selected', 'true');
    });
  });
});

describe('Host profile progress bar', () => {
  it('not visible if no host profile', () => {
    mockAPI.userPage();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.hostProfileProgressBar.self().should('not.exist');
  });

  it('Stripe onboarding not started', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/host_profile_individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.hostProfileProgressBar.self().should('exist');
    userPage.hostProfileProgressBar.getStep(1).should('have.attr', 'data-cy-active', 'true');
    userPage.hostProfileProgressBar.getStep(2).should('have.attr', 'data-cy-active', 'false');
    userPage.hostProfileProgressBar.getStep(3).should('have.attr', 'data-cy-active', 'false');
    userPage.hostProfileProgressBar.cta().should('have.text', 'Enter payment information');
  });
});

// describe('User can view their profile page - happy path', () => {
//   beforeEach(function () {
//     loadUserPageAPICalls();
//     cy.login('login/successful.json', 'george@mail.com', 'password', 200);
//     nav.to.userPage();
//   });

//   it('and deletes their account - no upcoming and request bookings - no host profile exists', () => {
//     deviseAuthRoute('DELETE', 200, 'fixture:successful_account_deletion.json');
//     getBookingStats('0', '0', '2', '0', '0', '0', '3', '0');
//     cy.get('#delete-account-link').click();
//     checkWindowConfirm();
//     checkWindowAlert('Your account was succesfully deleted!');
//     cy.contains('Welcome to KattBNB!').should('exist');
//   });

//   it('and cannot delete their account cause of upcoming and request bookings', () => {
//     getBookingStats('0', '1', '2', '0', '1', '0', '3', '0');
//     cy.get('#delete-account-link').click();
//     checkWindowAlert('To delete your account, you must not have any pending or unpaid bookings!');
//     cy.location('pathname').should('eq', '/user-page');
//   });
// });

// describe('User can view their profile page', () => {
//   it('and delete their account - host profile exists - no Stripe errors', () => {
//     deleteAccountAPICalls();
//     stripeCall(200, { message: 'Success!' });
//     cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
//     cy.get('#user-icon').click({ force: true });
//     cy.get('#delete-account-link').click();
//     checkWindowConfirm();
//     checkWindowAlert('Your account was succesfully deleted!');
//     cy.contains('Welcome to KattBNB!').should('exist');
//   });
// });

// describe('User can view their profile page', () => {
//   it('and cannot delete their account - host profile exists - Stripe errors', () => {
//     deleteAccountAPICalls();
//     stripeCall(555, { error: 'No success!' });
//     cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
//     cy.get('#user-icon').click({ force: true });
//     cy.get('#delete-account-link').click();
//     checkWindowConfirm();
//     cy.contains(
//       'Make sure your Stripe account balance is 0 and try again. If this error persists, please contact our support staff.'
//     ).should('exist');
//   });
// });
