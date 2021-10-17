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
    bookings.incoming.stripeAlert(0).should('not.exist');
    bookings.incoming.acceptRequestButton(0).click();
    cy.location('pathname').should('eq', '/request-accepted-success');
  });

  it('and successfully decline', () => {
    nav.to.bookings();
    bookings.all.ctaToIncoming().click();
    bookings.incoming.stripeAlert(0).should('not.exist');
    bookings.incoming.declineRequestButton(0).click();
    // TODO: FINISH THIS
  });

  it('and unsuccessfully decline cause they enter no message or message > 200 characters', () => {
    nav.to.bookings();
    bookings.all.ctaToIncoming().click();
    bookings.incoming.stripeAlert(0).should('not.exist');
    bookings.incoming.declineRequestButton(0).click();
    // TODO: FINISH THIS
  });
});

describe('User encounters error when accepting a booking request', () => {
  it('cause of Stripe error during payment', () => {
    cy.server();
    cy.intercept('GET', `${api}/host_profiles?user_id=66&locale=en-US`, {
      statusCode: 200,
      fixture: 'host_profile_index.json',
    });

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
    bookings.incoming.stripeAlert(0).should('not.exist');
    bookings.incoming.acceptRequestButton(0).click();
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
    });

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
    bookings.incoming.bookingRequestCtaSection(0).should('not.exist');
    bookings.incoming
      .stripeAlert(0)
      .should('exist')
      .and(
        'include.text',
        'For you to accept this booking, we will need your payment information. Without that we cannot transfer the money for your gigs!'
      );
    bookings.incoming.stripeAlert(0).find('button').should('exist').and('have.text', 'Enter payment information');
  });

  it('if stripe verification is pending', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_pending_verification.json',
    });

    bookings.all.ctaToIncoming().click();
    bookings.incoming.bookingRequestCtaSection(0).should('not.exist');
    bookings.incoming
      .stripeAlert(0)
      .should('exist')
      .and(
        'include.text',
        'Your verification with our payment provider (Stripe) is still pending. You will be able to accept this booking request as soon as you are verified. Please check back later.'
      );
  });

  it('if stripe verification is complete and errors exist', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_verification_errors.json',
    });
    bookings.all.ctaToIncoming().click();
    bookings.incoming.bookingRequestCtaSection(0).should('not.exist');
    bookings.incoming
      .stripeAlert(0)
      .should('exist')
      .and(
        'include.text',
        'In order for you to accept this request, you should visit your payment dashboard and complete your verification with our payment provider (Stripe).'
      );
    bookings.incoming.stripeAlert(0).find('button').should('exist').and('have.text', 'My payment dashboard');
  });
});
