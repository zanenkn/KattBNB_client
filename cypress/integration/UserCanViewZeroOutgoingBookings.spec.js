describe('User can view her outgoing bookings', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?user_id=1',
      status: 200,
      response: 'fixture:search_no_results.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#bookings-icon').click()
    })
  })

  it('and see relevant message if there are no bookings stored in the database', () => {
    cy.wait(2000)
    cy.contains("You don't have any Outgoing Bookings yet.")
  })

  it('and see relevant messages under each category of bookings', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.contains("You don't have any upcoming bookings.")
    cy.contains("You don't have any booking requests.")
    cy.contains("You don't have any past bookings.")
  })
})
