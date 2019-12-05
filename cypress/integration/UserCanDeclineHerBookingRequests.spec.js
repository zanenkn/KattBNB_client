describe('User can decline her booking request', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?host_nickname=GeorgeTheGreek',
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
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#bookings-icon').click()
    })
    cy.wait(3000)
    cy.get('#view-incoming-bookings').click()
  })

  it('successfully', () => {
    cy.get('#decline').click()
    cy.get('#message').type('I decline!')
    cy.get('#decline-button').click()
    cy.contains('Hi, GeorgeTheGreek!')
    cy.contains('Here you can manage your bookings.')
  })
})