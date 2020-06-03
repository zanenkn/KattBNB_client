describe('User can view her outgoing bookings', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_bookings.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: 'fixture:all_host_bookings.json'
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/reviews',
      status: 200,
      response: ''
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#bookings-icon').click({ force: true })
  })

  it('and see correct stats of her bookings', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-upcoming]').should('have.length', 2)
    cy.get('[data-cy=outgoing-requests]').should('have.length', 2)
    cy.get('[data-cy=outgoing-history]').should('have.length', 5)
  })

  it('and see her upcoming bookings displayed in correct chronological order', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-upcoming]').first().contains('You have successfully booked a stay with Accepted2 for your 1 cat for the dates of 2051-08-03 until 2051-08-07.')
    cy.get('[data-cy=outgoing-upcoming]').last().contains('You have successfully booked a stay with Accepted1 for your 1 cat for the dates of 2051-08-04 until 2051-08-08.')
  })

  it('and see her requested bookings displayed in correct chronological order', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-requests]').first().contains('You have requested to book a stay with Pending1 for your 1 cat during the dates of 2051-08-04 until 2051-08-05.')
    cy.get('[data-cy=outgoing-requests]').last().contains('You have requested to book a stay with Pending2 for your 1 cat during the dates of 2051-08-04 until 2051-08-05.')
  })

  it('and see her bookings history displayed in correct chronological order', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-history]').first().contains('Your cat(s) stayed with AcceptedOfThePast during the dates of 2019-11-26 until 2019-11-19.')
    cy.get('[data-cy=outgoing-history]').last().contains('Your request to book a stay with Canceled1 for your 1 cat during the dates of 2051-08-03 until 2051-08-08 got canceled.')
  })

  it("and see 'Leave a review' link if the booking has not been reviewed yet", () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-history]').first().contains('Leave a review')
  })

  it('and can succesfully review a booking', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-history]').first().get('#leave-review').click()
    cy.location('pathname').should('eq', '/leave-a-review')
    cy.get('#review-body').type('This is a successful review submission!')
    cy.get('.submit-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Your review was successfully submitted!')
    })
    cy.location('pathname').should('eq', '/all-bookings')
  })

  it('and cannot leave a review if the text area is blank', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-history]').first().get('#leave-review').click()
    cy.location('pathname').should('eq', '/leave-a-review')
    cy.get('.submit-button').click()
    cy.contains('Review message cannot be empty!')
  })

  it('and cannot leave a review if the text is longer than 1000 characters', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-history]').first().get('#leave-review').click()
    cy.location('pathname').should('eq', '/leave-a-review')
    cy.get('#review-body').type('No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters! No longer than 1000 characters!')
    cy.get('.submit-button').click()
    cy.contains('Review message cannot exceed 1000 characters!')
  })

  it('and see her own message in request bookings', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('#2').within(() => {
      cy.get('.fake-link-underlined').click({ force: true })
    })
    cy.contains('Please keep my cats, Pending1')
  })

  it('and see relevant host message in declined history bookings', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('#3').within(() => {
      cy.get('.fake-link-underlined').click()
    })
    cy.contains('Sorry, dude! I decline!')
  })

  it('and see upcoming booking details', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('#8').within(() => {
      cy.get('.fake-link-underlined').click({ force: true })
    })
    cy.get('p')
    cy.should('contain', '2051-08-04 until 2051-08-08')
    cy.should('contain', '678 kr')
    cy.should('contain', 'Some address in Sthlm')
  })

  it('and see information about cancelled booking', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('#6').within(() => {
      cy.get('.fake-link-underlined').click()
    })
    cy.get('.popup-content').contains('Your booking got automatically cancelled due to Canceled1 not responding within 3 days.')
  })
})

describe('User can view her outgoing bookings', () => {

  it("and see 'View your review' link if the booking has already been reviewed", () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:one_user_booking_review.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: 'fixture:all_host_bookings.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#bookings-icon').click({ force: true })
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-history]').first().contains('View your review')
  })
})

describe('User can view her outgoing bookings', () => {

  it('and cannot leave a review cause the host requested an account deletion in the process', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_bookings.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: 'fixture:all_host_bookings.json'
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/reviews',
      status: 422,
      response: ''
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#bookings-icon').click({ force: true })
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-history]').first().get('#leave-review').click()
    cy.location('pathname').should('eq', '/leave-a-review')
    cy.get('#review-body').type('This is not a successful review submission!')
    cy.get('.submit-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('The host you are trying to review requested an account deletion! You cannot review this booking.')
    })
    cy.location('pathname').should('eq', '/all-bookings')
  })
})

describe('User can view her outgoing bookings', () => {

  it('and sees relevant message if host has deleted her account before review of booking', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:one_user_booking_no_review_no_host.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: 'fixture:all_host_bookings.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#bookings-icon').click({ force: true })
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-history]').first().contains('Booking cannot be reviewed because host does not exist!')
  })
})
