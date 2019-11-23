describe('User can view her incoming bookings', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?host_nickname=GeorgeTheGreek',
      status: 200,
      response: 'fixture:all_host_bookings.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#bookings-icon').click()
    })
  })

  it('and see correct stats of her bookings', () => {
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-upcoming]').should('have.length', 2)
    cy.get('[data-cy=incoming-requests]').should('have.length', 2)
    cy.get('[data-cy=incoming-history]').should('have.length', 5)
  })

  it('and see her upcoming bookings displayed in correct chronological order', () => {
    const now = new Date(2019, 11, 20).getTime()
    cy.clock(now)
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-upcoming]').first().contains("You have approved a stay for Accepted1's 1 cat for the dates of 2019-11-26 until 2019-11-30.")
    cy.get('[data-cy=incoming-upcoming]').last().contains("You have approved a stay for Accepted2's 1 cat for the dates of 2019-11-25 until 2019-11-29.")
  })

  it('and see her requested bookings displayed in correct chronological order', () => {
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-requests]').first().contains('Pending1 wants to book a stay for their 1 cat during the dates of 2019-11-26 until 2019-11-27.')
    cy.get('[data-cy=incoming-requests]').last().contains('Pending2 wants to book a stay for their 1 cat during the dates of 2019-11-26 until 2019-11-27.')
  })

  it('and see her bookings history displayed in correct chronological order', () => {
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-history]').first().contains("You hosted AcceptedOfThePast's cat(s) during the dates of 2019-11-26 until 2019-11-19.")
    cy.get('[data-cy=incoming-history]').last().contains('A booking request from Canceled1 for their 1 cat during the dates of 2019-11-25 until 2019-11-30 got canceled due to no answer from you within 3 days time.')
  })
})
