describe('User cannot accept her booking request', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?stats=yes&user_id=1&host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: 'fixture:booking_stats.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?stats=no&host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: 'fixture:all_host_bookings.json'
    })
    cy.route({
      method: 'PATCH',
      url: 'http://localhost:3007/api/v1/bookings/2',
      status: 200,
      response: 'fixture:successful_booking_update.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(1000)
    cy.get('#bookings-icon').click({ force: true })
  })

  it('cause she does not have an account with Stripe', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/stripe?locale=en-US&host_profile_id=10&occasion=retrieve',
      status: 200,
      response: { "message": "No account" }
    })
    cy.get('#view-incoming-bookings').click()
    cy.get('#accept-2').should('have.class', 'disabled')
  })

  it('cause she is not verified by Stripe', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/stripe?locale=en-US&host_profile_id=10&occasion=retrieve',
      status: 200,
      response: 'fixture:stripe_verification_errors'
    })
    cy.get('#view-incoming-bookings').click()
    cy.get('#accept-2').should('have.class', 'disabled')
  })

  it('cause of Stripe error during information retrieval', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/stripe?locale=en-US&host_profile_id=10&occasion=retrieve',
      status: 555,
      response: { "error": "There was a problem connecting to our payments infrastructure provider. Please try again later." }
    })
    cy.get('#view-incoming-bookings').click()
    cy.get('#accept-2').should('have.class', 'disabled')
    cy.contains('There was a problem connecting to our payments infrastructure provider. Please try again later.')
  })
})
