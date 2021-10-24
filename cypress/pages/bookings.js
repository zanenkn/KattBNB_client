class Bookings {
  all = {
    ctaToIncoming: () => cy.get('[data-cy=view-incoming-bookings]'),
  };
  incoming = {
    upcomingBooking: () => cy.get('[data-cy=incoming-upcoming]'),
    bookingRequest: () => cy.get('[data-cy=incoming-request]'),
    pastBooking: () => cy.get('[data-cy=incoming-history]'),
    getPastBooking: (i) => this.incoming.pastBooking().eq(i),
    getUpcomingBooking: (i) => this.incoming.upcomingBooking().eq(i),
    getBookingRequest: (i) => this.incoming.bookingRequest().eq(i),
    acceptRequestButton: (i) => this.incoming.bookingRequest().eq(i).find('[data-cy=accept-request]'),
    declineRequestButton: (i) => this.incoming.bookingRequest().eq(i).find('[data-cy=decline-request]'),
    stripeAlert: (i) => this.incoming.bookingRequest().eq(i).find('[data-cy=stripe-alert]'),
    bookingRequestCtaSection: (i) => this.incoming.bookingRequest().eq(i).find('[data-cy=booking-request-cta-section]'),
  };
  declineRequestPopup = {
    textField: () => cy.get('[data-cy=message]'),
    submitButton: () => cy.get('[data-cy=decline-button]')
  }
}

module.exports = new Bookings();
