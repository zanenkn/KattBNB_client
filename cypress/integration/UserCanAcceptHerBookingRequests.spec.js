describe('User can accept her booking request', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?host_nickname=GeorgeTheGreek',
      status: 200,
      response: 'fixture:all_host_bookings.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?user_id=1',
      status: 200,
      response: 'fixture:all_user_bookings.json'
    })
    cy.route({
      method: 'PATCH',
      url: 'http://localhost:3007/api/v1/bookings/2',
      status: 200,
      response: 'fixture:successful_booking_update.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com',
      status: 200,
      response: 'fixture:validate_token.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(1000)
    //cy.get('#navlinks').within(() => {
      cy.get('#bookings-icon').click({force:true})
    //})
    cy.get('#view-incoming-bookings').click()
  })

  it('successfully', () => {
    cy.get('#accept-2').click()
    cy.contains('You have successfully accepted a booking request.')
  })
})