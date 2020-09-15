describe('User can accept her booking request', () => {
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
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/stripe?locale=en-US&host_profile_id=10&occasion=retrieve',
      status: 200,
      response: 'fixture:stripe_verification_no_errors'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(1000)
    cy.get('#bookings-icon').click({ force: true })
    cy.get('#view-incoming-bookings').click()
  })

  it('successfully', () => {
    cy.get('#accept-2').click()
    cy.contains('You have successfully accepted a booking request.')
  })
})
