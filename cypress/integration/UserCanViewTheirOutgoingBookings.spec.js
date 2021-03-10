const api = 'http://localhost:3007/api/v1';

function bookingDisplayOrder(element, text1, text2) {
  cy.get(element).first().should('include.text', text1);
  cy.get(element).last().should('include.text', text2);
}

function fetchUserBookings(fixture) {
  cy.route({
    method: 'GET',
    url: `${api}/bookings?stats=no&user_id=66&locale=en-US`,
    status: 200,
    response: fixture,
  });
}

function fetchUserBookingStats() {
  cy.route({
    method: 'GET',
    url: `${api}/bookings?stats=yes&user_id=66&host_nickname=GeorgeTheGreek&locale=en-US`,
    status: 200,
    response: 'fixture:booking_stats.json',
  });
}

function createReview(status) {
  cy.route({
    method: 'POST',
    url: `${api}/reviews`,
    status: status,
    response: '',
  });
}

describe('User can view their outgoing bookings', () => {
  before(() => {
    cy.server();
    fetchUserBookings('fixture:all_user_bookings.json');
    fetchUserBookingStats();
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.get('#bookings-icon').click({ force: true });
  });

  it('and see correct stats', () => {
    cy.get('#view-outgoing-bookings').click();
    cy.get('[data-cy=outgoing-upcoming]').should('have.length', 2);
    cy.get('[data-cy=outgoing-requests]').should('have.length', 2);
    cy.get('[data-cy=outgoing-history]').should('have.length', 5);
  });

  it('and see upcoming bookings displayed in correct chronological order', () => {
    bookingDisplayOrder(
      '[data-cy=outgoing-upcoming]',
      'You have successfully booked a stay with Accepted2 for your 1 cat for the dates of 2051-08-03 until 2051-08-07.',
      'You have successfully booked a stay with Accepted1 for your 1 cat for the dates of 2051-08-04 until 2051-08-08.'
    );
  });

  it('and see requested bookings displayed in correct chronological order', () => {
    bookingDisplayOrder(
      '[data-cy=outgoing-requests]',
      'You have requested to book a stay with Pending1 for your 1 cat during the dates of 2051-08-04 until 2051-08-05.',
      'You have requested to book a stay with Pending2 for your 1 cat during the dates of 2051-08-04 until 2051-08-05.'
    );
  });

  it('and see bookings history displayed in correct chronological order', () => {
    bookingDisplayOrder(
      '[data-cy=outgoing-history]',
      'Your cat(s) stayed with AcceptedOfThePast during the dates of 2019-11-26 until 2019-11-19.',
      'Your request to book a stay with Canceled1 for your 1 cat during the dates of 2051-08-03 until 2051-08-08 got canceled.'
    );
  });

  it('and see receipt of selected upcoming booking and a download option', () => {
    cy.get('#booking-receipt-7').click();
    cy.location('pathname').should('eq', '/booking-receipt');
    cy.contains('Receipt #7').should('exist');
    cy.contains('Accepted2').should('exist');
  });

  it('and see receipt of selected history booking and a download option', () => {
    cy.server();
    fetchUserBookings('fixture:all_user_bookings.json');
    cy.go('back');
    cy.get('#booking-receipt-9').click();
    cy.location('pathname').should('eq', '/booking-receipt');
    cy.contains('Receipt #9').should('exist');
    cy.contains('AcceptedOfThePast').should('exist');
  });

  it("and see 'Leave a review' link if the booking has not been reviewed yet", () => {
    cy.server();
    fetchUserBookings('fixture:all_user_bookings.json');
    cy.go('back');
    cy.get('[data-cy=outgoing-history]').first().should('include.text', 'Leave a review');
  });

  it('and see their own message in request bookings', () => {
    cy.get('#2').within(() => {
      cy.get('.fake-link-underlined').click({ force: true });
    });
    cy.contains('Please keep my cats, Pending1').should('exist');
  });

  it('and see relevant host message in declined history bookings', () => {
    cy.get('.popup-overlay').click({ force: true });
    cy.get('#3').within(() => {
      cy.get('.fake-link-underlined').click({ force: true });
    });
    cy.contains('Sorry, dude! I decline!').should('exist');
  });

  it('and see information about cancelled booking', () => {
    cy.get('.popup-overlay').click({ force: true });
    cy.get('#6').within(() => {
      cy.get('.fake-link-underlined').click({ force: true });
    });
    cy.get('.popup-content').should(
      'include.text',
      'Your booking got automatically cancelled due to Canceled1 not responding within 3 days.'
    );
  });

  it('and see upcoming booking details', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${api}/reviews?host_profile_id=10&locale=en-US`,
      status: 200,
      response: [],
    });
    cy.get('#8').within(() => {
      cy.get('#booking-details-8').click({ force: true });
    });
    cy.get('p');
    cy.should('contain', '2051-08-04 until 2051-08-08');
    cy.should('contain', '822.08 kr');
    cy.should('contain', 'Some address in Sthlm');
    cy.wait(1000);
  });

  it('and cannot leave a review if no score is selected', () => {
    cy.server();
    fetchUserBookings('fixture:all_user_bookings.json');
    cy.go('back');
    cy.get('[data-cy=outgoing-history]').first().get('#leave-review').click();
    cy.location('pathname').should('eq', '/leave-a-review');
    cy.get('.submit-button').click();
    cy.contains('Please choose a score from 1 (poor) to 5 (excellent) for your review!').should('exist');
  });

  it('and cannot leave a review if the text area is blank', () => {
    cy.get('#1').click();
    cy.get('.submit-button').click();
    cy.contains('Please leave a short description of your stay!').should('exist');
  });

  it('and cannot leave a review if the text is longer than 1000 characters', () => {
    cy.get('#review-body').type(
      'No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer'
    );
    cy.get('.submit-button').click();
    cy.contains('Review message cannot exceed 1000 characters!').should('exist');
  });

  it('and can succesfully review a booking', () => {
    cy.server();
    fetchUserBookingStats();
    createReview(200);
    cy.get('#review-body').clear().type('This is a successful review submission!');
    cy.get('.submit-button').click();
    cy.location('pathname').should('eq', '/successful-review');
    cy.contains('Thank you for your review!').should('exist');
    cy.get('#back-to-bookings').click();
    cy.location('pathname').should('eq', '/all-bookings');
    cy.contains('Here you can manage your bookings.').should('exist');
  });

  it("and see 'View your review' link if the booking has already been reviewed", () => {
    cy.server();
    fetchUserBookings('fixture:one_user_booking_review.json');
    cy.get('#bookings-icon').click({ force: true });
    cy.get('#view-outgoing-bookings').click();
    cy.get('[data-cy=outgoing-history]').first().should('include.text', 'View your review');
  });

  it("and click 'View your review' and view a review they wrote", () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${api}/reviews/2`,
      status: 200,
      response: 'fixture:one_review_outgoing.json',
    });
    cy.get('[data-cy=outgoing-history]').first().should('include.text', 'View your review');
    cy.get('span > .fake-link-underlined').click();
    cy.contains(
      'You reviewed your booking with AcceptedOfThePast for the dates of 2019-11-26 until 2019-11-19.'
    ).should('exist');
    cy.contains('Almost good!').should('exist');
    cy.contains('4/5').should('exist');
  });

  it('and cannot leave a review cause the host requested an account deletion in the process', () => {
    cy.server();
    fetchUserBookings('fixture:all_user_bookings.json');
    fetchUserBookingStats();
    createReview(422);
    cy.get('#bookings-icon').click({ force: true });
    cy.get('#view-outgoing-bookings').click();
    cy.get('[data-cy=outgoing-history]').first().get('#leave-review').click();
    cy.location('pathname').should('eq', '/leave-a-review');
    cy.get('#1').click();
    cy.get('#review-body').type('This is not a successful review submission!');
    cy.get('.submit-button').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal(
        'The host you are trying to review have deleted their account! You cannot review this booking.'
      );
    });
    cy.location('pathname').should('eq', '/all-bookings');
  });

  it('and sees relevant message if host has deleted their account before review of booking', () => {
    cy.server();
    cy.fixture('one_user_booking_review.json').then((booking_review) => {
      booking_review[0].host_profile_id = null;
      booking_review[0].review_id = null;
      cy.route({
        method: 'GET',
        url: `${api}/bookings?stats=no&user_id=66&locale=en-US`,
        status: 200,
        response: booking_review,
      });
    });
    cy.get('#view-outgoing-bookings').click();
    cy.get('[data-cy=outgoing-history]')
      .first()
      .should('include.text', 'Booking cannot be reviewed because host does not exist!');
  });
});
