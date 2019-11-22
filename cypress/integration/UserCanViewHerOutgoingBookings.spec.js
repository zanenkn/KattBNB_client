describe('User can view her outgoing bookings', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?user_id=1',
      status: 200,
      response: 'fixture:all_user_bookings.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#bookings-icon').click()
    })
  })

  it('and see correct stats of her bookings', () => {
    cy.wait(2000)
    cy.contains('Requests: 2')
    cy.contains('Upcoming: 2')
    cy.contains('History: 5')
  })

  it('and see her upcoming bookings displayed in correct chronological order', () => {
    const now = new Date(2019, 11, 20).getTime()
    cy.clock(now)
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-upcoming]').first().contains('You have successfully booked a stay with Accepted1 for your 1 cat for the dates of 2019-11-26 until 2019-11-30.')
    cy.get('[data-cy=outgoing-upcoming]').last().contains('You have successfully booked a stay with Accepted2 for your 1 cat for the dates of 2019-11-25 until 2019-11-29.')
  })

  it('and see her requested bookings displayed in correct chronological order', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-requests]').first().contains('You have requested to book a stay with Pending1 for your 1 cat during the dates of 2019-11-26 until 2019-11-27.')
    cy.get('[data-cy=outgoing-requests]').last().contains('You have requested to book a stay with Pending2 for your 1 cat during the dates of 2019-11-26 until 2019-11-27.')
  })

  it('and see her bookings history displayed in correct chronological order', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-history]').first().contains('Your cat(s) stayed with AcceptedOfThePast during the dates of 2019-11-26 until 2019-11-19.')
    cy.get('[data-cy=outgoing-history]').last().contains('Your request to book a stay with Canceled1 for your 1 cat during the dates of 2019-11-25 until 2019-11-30 got canceled.')
  })
})
