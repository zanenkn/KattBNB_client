import nav from '../../pages/navigation';
import login from '../../pages/login';
import userPage from '../../pages/userPage';

const api = 'http://localhost:3007/api/v1';

function checkWindowAlert(text) {
  cy.on('window:alert', (str) => {
    expect(str).to.equal(text);
  });
}

function checkWindowConfirm() {
  cy.on('window:confirm', (str) => {
    expect(str).to.equal('Do you really want to delete your account?');
  });
}

function deviseAuthRoute(method, status, response) {
  cy.route({
    method: method,
    url: `${api}/auth`,
    status: status,
    response: response,
  });
}

function deviseAuthPassword(status, response) {
  cy.route({
    method: 'PUT',
    url: `${api}/auth/password`,
    status: status,
    response: response,
  });
}

function getBookingStats(inR, inU, inH, inUnp, outR, outU, outH, outUnp) {
  cy.route({
    method: 'GET',
    url: `${api}/bookings?stats=yes&user_id=66&host_nickname=GeorgeTheGreek&locale=en-US`,
    status: 200,
    response: {
      stats: {
        in_requests: inR,
        in_upcoming: inU,
        in_history: inH,
        in_unpaid: inUnp,
        out_requests: outR,
        out_upcoming: outU,
        out_history: outH,
        out_unpaid: outUnp,
      },
    },
  });
}

function deleteAccountAPICalls() {
  cy.server();
  cy.route({
    method: 'GET',
    url: `${api}/host_profiles?user_id=66&locale=en-US`,
    status: 200,
    response: 'fixture:host_profile_index.json',
  });
  cy.route({
    method: 'GET',
    url: `${api}/host_profiles/1?locale=en-US`,
    status: 200,
    response: 'fixture:host_profile_individual.json',
  });
  cy.route({
    method: 'GET',
    url: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=retrieve`,
    status: 200,
    response: { message: 'No account' },
  });
  cy.route({
    method: 'GET',
    url: `${api}/reviews?host_profile_id=1&locale=en-US`,
    status: 200,
    response: 'fixture:one_user_reviews.json',
  });
  deviseAuthRoute('DELETE', 200, 'fixture:successful_account_deletion.json');
  cy.route({
    method: 'GET',
    url: `${api}/bookings?dates=only&stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
    status: 200,
    response: [],
  });
  getBookingStats('0', '0', '1', '0', '0', '0', '3', '0');
}

function stripeCall(status, response) {
  cy.route({
    method: 'GET',
    url: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=delete_account`,
    status: status,
    response: response,
  });
}

function loadUserPageAPICalls() {
  cy.server();
  cy.route({
    method: 'GET',
    url: `${api}/host_profiles?user_id=66&locale=en-US`,
    status: 200,
    response: [],
  });
  cy.route({
    method: 'GET',
    url: `${api}/bookings?dates=only&stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
    status: 200,
    response: [],
  });
}

describe('User tries to view profile page', () => {
  it('without logging in', () => {
    loadUserPageAPICalls();
    cy.visit('http://localhost:3000/user-page');
    login.loginForm().should('exist');
  });
});

describe('User views profile page when logged in', () => {
  beforeEach(function () {
    loadUserPageAPICalls();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
  });

  it('has no host profile', () => {
    nav.to.userPage();
    userPage.wrapper().should('exist');
  });

  it('has host profile', () => {});
});

describe('User can view their profile page - happy path', () => {
  beforeEach(function () {
    loadUserPageAPICalls();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
  });

  it('successfully', () => {
    cy.contains('GeorgeTheGreek').should('exist');
  });

  it('and change location successfully', () => {
    deviseAuthRoute('PUT', 200, 'fixture:successful_location_change.json');
    cy.get('#editLocationForm').click();
    cy.get('#location').click();
    cy.get('.ui > #location > .visible > .item:nth-child(5) > .text').click();
    cy.get('#location-submit-button').click();
    checkWindowAlert('Location succesfully changed!');
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
