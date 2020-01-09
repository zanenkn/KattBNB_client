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
    cy.get('#navlinks').within(() => {
      cy.get('#bookings-icon').click()
    })
    cy.get('#view-incoming-bookings').click()
  })

  it('successfully', () => {
    cy.get('#decline').click()
    cy.get('#message').type('I decline!')
    cy.get('#decline-button').click()
    cy.contains('Hi, GeorgeTheGreek!')
    cy.contains('Here you can manage your bookings.')
  })

  it('unsuccessfully cause she enters no message', () => {
    cy.get('#decline').click()
    cy.get('#decline-button').click()
    cy.contains("Message can't be blank or more than 200 characters!")
  })

  it('unsuccessfully cause the message is more than 200 characters', () => {
    cy.get('#decline').click()
    cy.get('#message').type('I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!!')
    cy.get('#decline-button').click()
    cy.contains("Message can't be blank or more than 200 characters!")
  })
})