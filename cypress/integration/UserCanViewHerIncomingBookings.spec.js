describe('User can view her incoming bookings', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: 'fixture:all_host_bookings.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_bookings.json'
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/conversations',
      status: 200,
      response: 'fixture:create_conversation.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#bookings-icon').click({ force: true })
    cy.wait(2000)
  })

  it('and see correct stats of her bookings', () => {
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-upcoming]').should('have.length', 2)
    cy.get('[data-cy=incoming-requests]').should('have.length', 2)
    cy.get('[data-cy=incoming-history]').should('have.length', 5)
  })

  it('and see her upcoming bookings displayed in correct chronological order', () => {
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-upcoming]').first().contains("You have approved a stay for Accepted2's 1 cat for the dates of 2051-08-03 until 2051-08-07.")
    cy.get('[data-cy=incoming-upcoming]').last().contains("You have approved a stay for Accepted1's 1 cat for the dates of 2051-08-04 until 2051-08-08.")
  })

  it('and see her requested bookings displayed in correct chronological order', () => {
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-requests]').first().contains('Pending1 wants to book a stay for their 1 cat during the dates of 2051-08-04 until 2051-08-05.')
    cy.get('[data-cy=incoming-requests]').last().contains('Pending2 wants to book a stay for their 1 cat during the dates of 2051-08-04 until 2051-08-05.')
  })

  it('and see the message left by the user when she clicks the relevant link of a requested booking', () => {
    cy.get('#view-incoming-bookings').click()
    cy.get(':nth-child(1) > :nth-child(4) > .fake-link-underlined').click()
    cy.contains('Please keep my cats, Pending1')
  })

  it('and see her bookings history displayed in correct chronological order', () => {
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-history]').first().contains("You hosted AcceptedOfThePast's cat(s) during the dates of 2019-11-26 until 2019-11-19.")
    cy.get('[data-cy=incoming-history]').last().contains('A booking request from Canceled1 for their 1 cat during the dates of 2051-08-03 until 2051-08-08 got canceled due to no answer from you within 3 days time.')
  })

  it("and see 'Ask for review' link if there is no review and get redirected to messenger when she clicks the link", () => {
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-history]').first().contains('Ask for a review')
    cy.get('#ask-review').click()
    cy.location('pathname').should('eq', '/conversation')
  })

  it('and see a message she wrote when she declined a booking', () => {
    cy.get('#view-incoming-bookings').click()
    cy.get('#3').within(() => {
      cy.get('.fake-link-underlined').click()
    })
    cy.contains('Sorry, dude! I decline!')
  })
})

describe('User can view her incoming bookings', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: 'fixture:one_host_booking_review.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_bookings.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/reviews/5',
      status: 200,
      response: 'fixture:one_review_incoming.json'
    })
  })

  it("and see 'View review' link if there is a review", () => {
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#bookings-icon').click({ force: true })
    cy.wait(2000)
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-history]').first().contains('View review')
  })

  it("and see 'View review' link and click it and view the review", () => {
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#bookings-icon').click({ force: true })
    cy.wait(2000)
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-history]').first().contains('View review')
    cy.get('.fake-link-underlined').click()
    cy.contains("AcceptedOfThePast left you a review for a booking between the dates of 2019-11-26 and 2019-11-19.")
    cy.contains("Excellent job George!")
    cy.contains("5/5")
  })
})

describe('User can view her incoming bookings', () => {
  it("and see 'Ask for review' link if there is no review and get error message if other user does not exist", () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: 'fixture:all_host_bookings.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_bookings.json'
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/conversations',
      status: 422,
      response: ''
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#bookings-icon').click({ force: true })
    cy.wait(2000)
    cy.get('#view-incoming-bookings').click()
    cy.get('[data-cy=incoming-history]').first().contains('Ask for a review')
    cy.get('#ask-review').click()
    cy.contains('The user you are trying to reach has requested an account deletion!')
  })
})
