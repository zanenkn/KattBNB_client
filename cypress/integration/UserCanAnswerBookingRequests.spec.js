const api = 'http://localhost:3007/api/v1';
const bookings = `${api}/bookings`;
const auth_token_validation = `${api}/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com`;
const url = {
  stripe: `${api}/stripe?locale=en-US&host_profile_id=10&occasion=retrieve`,
};

describe('User can answer her booking request', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=yes&user_id=1&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:booking_stats.json',
    });
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:all_host_bookings.json',
    });
    cy.route({
      method: 'PATCH',
      url: `${bookings}/2`,
      status: 200,
      response: 'fixture:successful_booking_update.json',
    });
    //token step needed only when declining a booking
    cy.route({
      method: 'GET',
      url: `${auth_token_validation}`,
      status: 200,
      response: 'fixture:validate_token.json',
    });
    cy.route({
      method: 'GET',
      url: `${api}/stripe?locale=en-US&host_profile_id=10&occasion=retrieve`,
      status: 200,
      response: 'fixture:stripe_verification_no_errors',
    });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.wait(1000);
    cy.get('#bookings-icon').click({ force: true });
    cy.get('#view-incoming-bookings').click();
  });

  it('successfully accept booking request', () => {
    cy.get('#accept-2').trigger('mouseover');
    cy.get('#popover-2').should('not.be.visible');
    cy.get('#accept-2').click();
    cy.contains('You have successfully accepted a booking request.');
  });

  it('successfully decline booking request', () => {
    cy.get('#decline').click();
    cy.get('#message').type('I decline!');
    cy.get('#decline-button').click();
    cy.contains('Hi, GeorgeTheGreek!');
    cy.contains('Here you can manage your bookings.');
  });

  it('unsuccessfully decline cause she enters no message', () => {
    cy.get('#decline').click();
    cy.get('#decline-button').click();
    cy.get('.popup-content').contains("Message can't be blank or contain more than 200 characters!");
  });

  it('unsuccessfully decline cause the message is more than 200 characters', () => {
    cy.get('#decline').click();
    cy.get('#message').type(
      'I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!!'
    );
    cy.get('#decline-button').click();
    cy.get('.popup-content').contains("Message can't be blank or contain more than 200 characters!");
  });
});

describe('User encounters error when accepting a booking request', () => {
  it('cause of Stripe error during payment', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=yes&user_id=1&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:booking_stats.json',
    });
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:all_host_bookings.json',
    });
    cy.route({
      method: 'PATCH',
      url: `${bookings}/2`,
      status: 555,
      response: {
        error: 'There was a problem connecting to our payments infrastructure provider. Please try again later.',
      },
    });
    cy.route({
      method: 'GET',
      url: `${api}/stripe?locale=en-US&host_profile_id=10&occasion=retrieve`,
      status: 200,
      response: 'fixture:stripe_verification_no_errors',
    });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.wait(1000);
    cy.get('#bookings-icon').click({ force: true });
    cy.get('#view-incoming-bookings').click();
    cy.get('#accept-2').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal(
        'There was a problem connecting to our payments infrastructure provider. Please try again later.'
      );
    });
    cy.location('pathname').should('eq', '/all-bookings');
  });
});

describe('User cannot accept booking requests', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=yes&user_id=1&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:booking_stats.json',
    });
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:all_host_bookings.json',
    });
    cy.route({
      method: 'PATCH',
      url: `${bookings}/2`,
      status: 200,
      response: 'fixture:successful_booking_update.json',
    });
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: { message: 'No account' },
    });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.wait(1000);
    cy.get('#bookings-icon').click({ force: true });
    cy.get('#view-incoming-bookings').click();
  });

  it('if no stripe information is provided', () => {
    cy.get('[style="text-align: center; margin: 2rem 0px;"]').contains('Please visit your profile page to fix that.');
    cy.get('#accept-1').should('have.class', 'disabled');
    cy.get('#accept-1').trigger('mouseover');
    cy.get('#popover-1').should('be.visible');
    cy.get('#accept-2').should('have.class', 'disabled');
    cy.get('#accept-2').trigger('mouseover');
    cy.get('#popover-2').should('be.visible');
  });
});

describe('User cannot accept booking requests', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=yes&user_id=1&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:booking_stats.json',
    });
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:all_host_bookings.json',
    });
    cy.route({
      method: 'PATCH',
      url: `${bookings}/2`,
      status: 200,
      response: 'fixture:successful_booking_update.json',
    });
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_pending_verification.json',
    });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.wait(1000);
    cy.get('#bookings-icon').click({ force: true });
    cy.get('#view-incoming-bookings').click();
  });

  it('if stripe verification is pending', () => {
    cy.get('[style="text-align: center; margin-top: 2rem; font-size: unset;"]').contains(
      'Your verification is pending, please check back later.'
    );
    cy.get('#progress-bar-cta').should('not.contain', 'My payment dashboard');
    cy.get('#accept-1').should('have.class', 'disabled');
    cy.get('#accept-1').trigger('mouseover');
    cy.get('#popover-1').should('be.visible');
    cy.get('#accept-2').should('have.class', 'disabled');
    cy.get('#accept-2').trigger('mouseover');
    cy.get('#popover-2').should('be.visible');
  });
});

describe('User cannot accept booking requests', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=yes&user_id=1&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:booking_stats.json',
    });
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:all_host_bookings.json',
    });
    cy.route({
      method: 'PATCH',
      url: `${bookings}/2`,
      status: 200,
      response: 'fixture:successful_booking_update.json',
    });
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_verification_errors.json',
    });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.wait(1000);
    cy.get('#bookings-icon').click({ force: true });
    cy.get('#view-incoming-bookings').click();
  });

  it('if stripe verification is complete and errors exist', () => {
    cy.get('[style="text-align: center; margin-top: 2rem; font-size: unset;"]').contains(
      'Please visit your payment dashboard to complete your verification.'
    );
    cy.get('#progress-bar-cta').contains('My payment dashboard');
    cy.get('#accept-1').should('have.class', 'disabled');
    cy.get('#accept-1').trigger('mouseover');
    cy.get('#popover-1').contains('you should complete your verification with our payment provider');
    cy.get('#accept-2').should('have.class', 'disabled');
    cy.get('#accept-2').trigger('mouseover');
    cy.get('#popover-2').contains('you should complete your verification with our payment provider');
  });
});
