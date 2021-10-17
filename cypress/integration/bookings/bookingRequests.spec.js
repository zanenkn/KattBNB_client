import nav from '../../pages/navigation';
import bookings from '../../pages/bookings';

const api = 'http://localhost:3007/api/v1';
const bookingsRoute = `${api}/bookings`;
const auth_token_validation = `${api}/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com`;
const url = {
  stripe: `${api}/stripe?locale=en-US&host_profile_id=10&occasion=retrieve`,
};

function updateBooking() {
  cy.route({
    method: 'GET',
    url: `${bookingsRoute}?stats=yes&user_id=66&host_nickname=GeorgeTheGreek&locale=en-US`,
    status: 200,
    response: 'fixture:bookings/booking_stats.json',
  });
  cy.route({
    method: 'GET',
    url: `${bookingsRoute}?stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
    status: 200,
    response: 'fixture:bookings/all_host_bookings.json',
  });
  cy.route({
    method: 'PATCH',
    url: `${bookingsRoute}/2`,
    status: 200,
    response: 'fixture:successful_booking_update.json',
  });
}

function checkPopover() {
  cy.get('#accept-1').should('have.class', 'disabled');
  cy.get('#accept-1').trigger('mouseover');
  cy.get('#popover-1').should('be.visible');
  cy.get('#accept-2').should('have.class', 'disabled');
  cy.get('#accept-2').trigger('mouseover');
  cy.get('#popover-2').should('be.visible');
}

describe('User can answer booking request', () => {
  beforeEach(() => {
    cy.server();

    updateBooking();
    //token step needed only when declining a booking
    cy.intercept('GET', `${api}/host_profiles?user_id=66&locale=en-US`, {
      statusCode: 200,
      fixture: 'host_profile_index.json',
    }).as('getRoute');

    cy.intercept('GET', `${api}/host_profiles/1?locale=en-US`, {
      statusCode: 200,
      fixture: 'host_profile_individual.json',
    });

    cy.intercept('GET', `${auth_token_validation}`, {
      statusCode: 200,
      fixture: 'validate_token.json',
    });

    cy.intercept('GET', `${api}/stripe?locale=en-US&host_profile_id=10&occasion=retrieve`, {
      statusCode: 200,
      fixture: 'stripe_verification_no_errors',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
  });

  it('and successfully accept', () => {
    nav.to.bookings();
    bookings.all.ctaToIncoming().click();
    bookings.incoming.acceptRequestButton(0).click();
    cy.location('pathname').should('eq', '/request-accepted-success');
  });

  it('and successfully decline', () => {
    cy.get('#decline').click();
    cy.get('#message').type('I decline!');
    cy.get('#decline-button').click();
    cy.contains('Hi, GeorgeTheGreek!').should('exist');
    cy.contains('Here you can manage your bookings.').should('exist');
  });

  it('and unsuccessfully decline cause they enter no message or message > 200 characters', () => {
    cy.get('#decline').click();
    cy.get('#decline-button').click();
    cy.get('.popup-content').should('include.text', "Message can't be blank or contain more than 200 characters!");
    cy.get('#message').type(
      'I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!!'
    );
    cy.get('#decline-button').click();
    cy.get('.popup-content').should('include.text', "Message can't be blank or contain more than 200 characters!");
  });
});

describe('User encounters error when accepting a booking request', () => {
  it('cause of Stripe error during payment', () => {
    cy.server();
    cy.intercept('GET', `${api}/host_profiles?user_id=66&locale=en-US`, {
      statusCode: 200,
      fixture: 'host_profile_index.json',
    }).as('getRoute');

    cy.route({
      method: 'GET',
      url: `${api}/host_profiles/1?locale=en-US`,
      status: 200,
      response: 'fixture:host_profile_individual.json',
    });
    cy.route({
      method: 'GET',
      url: `${bookingsRoute}?stats=yes&user_id=66&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:bookings/booking_stats.json',
    });
    cy.route({
      method: 'GET',
      url: `${bookingsRoute}?stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:bookings/all_host_bookings.json',
    });
    cy.route({
      method: 'PATCH',
      url: `${bookingsRoute}/2`,
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
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.bookings();
    bookings.all.ctaToIncoming().click();
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
    updateBooking();
    cy.intercept('GET', `${api}/host_profiles?user_id=66&locale=en-US`, {
      statusCode: 200,
      fixture: 'host_profile_index.json',
    }).as('getRoute');

    cy.route({
      method: 'GET',
      url: `${api}/host_profiles/1?locale=en-US`,
      status: 200,
      response: 'fixture:host_profile_individual.json',
    });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.bookings();
  });

  it('if no stripe information is provided', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: { message: 'No account' },
    });
    bookings.all.ctaToIncoming().click();
    cy.get('[style="text-align: center; margin: 2rem 0px;"]')
      .invoke('text')
      .then((text) => {
        expect(text).to.include('You made a host profile but have not provided us with your payment information.');
      });
    checkPopover();
  });

  it('if stripe verification is pending', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_pending_verification.json',
    });
    bookings.all.ctaToIncoming().click();
    cy.get('[style="text-align: center; margin-top: 2rem; font-size: unset;"]').should(
      'include.text',
      'Your verification is pending, please check back later.'
    );
    cy.get('#progress-bar-cta').should('not.exist');
    checkPopover();
  });

  it('if stripe verification is complete and errors exist', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_verification_errors.json',
    });
    bookings.all.ctaToIncoming().click();
    cy.get('[style="text-align: center; margin-top: 2rem; font-size: unset;"]').should(
      'include.text',
      'You have entered your payment information but are not yet verified with'
    );
    cy.get('#progress-bar-cta').should('have.text', 'My payment dashboard');
    cy.get('#accept-1').should('have.class', 'disabled');
    cy.get('#accept-1').trigger('mouseover');
    cy.get('#popover-1').should('include.text', 'You have entered your payment information but are not yet verified');
    cy.get('#accept-2').should('have.class', 'disabled');
    cy.get('#accept-2').trigger('mouseover');
    cy.get('#popover-2').should('include.text', 'You have entered your payment information but are not yet verified');
  });
});
