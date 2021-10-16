class Bookings {
  all = {
    ctaToIncoming: () => cy.get('[data-cy=view-incoming-bookings]')
  }
  incoming = {
    upcomingBooking: () => cy.get('[data-cy=incoming-upcoming]'),
    bookingRequest: () => cy.get('[data-cy=incoming-request]'),
    pastBooking: () => cy.get('[data-cy=incoming-history]'),
    getPastBooking: (i) => this.incoming.pastBooking().eq(i)
  }
}

module.exports = new Bookings();