import nav from '../../pages/navigation';
import bookings from '../../pages/bookings';
import { api } from '../../support/constants';

const bookingsRoute = `${api}/bookings`;
const auth_token_validation = `${api}/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com`;
const url = {
  stripe: `${api}/stripe?locale=en-US&host_profile_id=10&occasion=retrieve`,
};

function updateBooking() {
  cy.intercept('GET', `${bookingsRoute}?stats=yes&user_id=66&host_nickname=GeorgeTheGreek&locale=en-US`, {
    statusCode: 200,
    fixture: 'bookings/booking_stats.json',
  });
  cy.intercept('GET', `${bookingsRoute}?stats=no&host_nickname=GeorgeTheGreek&locale=en-US`, {
    statusCode: 200,
    fixture: 'bookings/all_host_bookings.json',
  });
  cy.intercept('PATCH', `${bookingsRoute}/2`, { statusCode: 200, fixture: 'bookings/successful_update.json' });
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

  it.only('and successfully decline', () => {
    nav.to.bookings();
    bookings.all.ctaToIncoming().click();
    bookings.incoming.stripeAlert(0).should('not.exist');
    bookings.incoming.declineRequestButton(0).click();
    bookings.declineRequestPopup.textField().type('No sorry')
    bookings.declineRequestPopup.submitButton().click()
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

    cy.intercept('GET', `${api}/host_profiles/1?locale=en-US`, {
      statusCode: 200,
      fixture: 'host_profile_individual.json',
    });
    cy.intercept('GET', `${bookingsRoute}?stats=yes&user_id=66&host_nickname=GeorgeTheGreek&locale=en-US`, {
      statusCode: 200,
      fixture: 'bookings/booking_stats.json',
    });
    cy.intercept('GET', `${bookingsRoute}?stats=no&host_nickname=GeorgeTheGreek&locale=en-US`, {
      statusCode: 200,
      fixture: 'bookings/all_host_bookings.json',
    });
    cy.intercept('PATCH', `${bookingsRoute}/2`, {
      statusCode: 555,
      body: {
        error: 'There was a problem connecting to our payments infrastructure provider. Please try again later.',
      },
    });
    cy.intercept('GET', `${api}/stripe?locale=en-US&host_profile_id=10&occasion=retrieve`, {
      statusCode: 200,
      fixture: 'stripe_verification_no_errors',
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

    cy.intercept('GET', `${api}/host_profiles/1?locale=en-US`, {
      statusCode: 200,
      fixture: 'host_profile_individual.json',
    });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.bookings();
  });

  it('if no stripe information is provided', () => {
    cy.intercept('GET', `${url.stripe}`, { statusCode: 200, body: { message: 'No account' } });
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
    cy.intercept('GET', `${url.stripe}`, { statusCode: 200, fixture: 'stripe_pending_verification.json' });

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
    cy.intercept('GET', `${url.stripe}`, { statusCode: 200, fixture: 'stripe_verification_errors.json' });
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
