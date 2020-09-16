const api = 'http://localhost:3007/api/v1'
const bookings = `${api}/bookings`
const auth_token_validation = `${api}/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com`

describe('User can answer her booking request', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=yes&user_id=1&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:booking_stats.json'
    })
    cy.route({
      method: 'GET',
      url: `${bookings}?stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: 'fixture:all_host_bookings.json'
    })
    cy.route({
      method: 'PATCH',
      url: `${bookings}/2`,
      status: 200,
      response: 'fixture:successful_booking_update.json'
    })
    //token step needed only when declining a booking
    cy.route({
      method: 'GET',
      url: `${auth_token_validation}`,
      status: 200,
      response: 'fixture:validate_token.json'
    })
    cy.route({
      method: 'GET',
      url: `${api}/stripe?locale=en-US&host_profile_id=10&occasion=retrieve`,
      status: 200,
      response: 'fixture:stripe_verification_no_errors'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(1000)
    cy.get('#bookings-icon').click({ force: true })
    cy.get('#view-incoming-bookings').click()
  })

  it('successfully accept booking request', () => {
    cy.get('#accept-2').click()
    cy.contains('You have successfully accepted a booking request.')
  })

  it('successfully decline booking request', () => {
    cy.get('#decline').click()
    cy.get('#message').type('I decline!')
    cy.get('#decline-button').click()
    cy.contains('Hi, GeorgeTheGreek!')
    cy.contains('Here you can manage your bookings.')
  })

  it('unsuccessfully decline cause she enters no message', () => {
    cy.get('#decline').click()
    cy.get('#decline-button').click()
    cy.get('.popup-content').contains("Message can't be blank or contain more than 200 characters!")
  })

  it('unsuccessfully decline cause the message is more than 200 characters', () => {
    cy.get('#decline').click()
    cy.get('#message').type('I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!I decline!!')
    cy.get('#decline-button').click()
    cy.get('.popup-content').contains("Message can't be blank or contain more than 200 characters!")
  })
})
