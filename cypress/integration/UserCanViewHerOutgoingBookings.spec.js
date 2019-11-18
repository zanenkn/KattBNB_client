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

  it('', () => {

  })

  it('', () => {

  })

  it('', () => {

  })

  it('', () => {

  })

  it('', () => {

  })

  it('', () => {

  })

  it('', () => {

  })
})
