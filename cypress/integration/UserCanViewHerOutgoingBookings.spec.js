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

  it('and see correct stats of her bookings', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-upcoming]').should('have.length', 2)
    cy.get('[data-cy=outgoing-requests]').should('have.length', 2)
    cy.get('[data-cy=outgoing-history]').should('have.length', 5)
  })

  it('and see her upcoming bookings displayed in correct chronological order', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('[data-cy=outgoing-upcoming]').first().contains('You have successfully booked a stay with Accepted1 for your 1 cat for the dates of 2051-08-04 until 2051-08-08.')
    cy.get('[data-cy=outgoing-upcoming]').last().contains('You have successfully booked a stay with Accepted2 for your 1 cat for the dates of 2051-08-03 until 2051-08-07.')
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
      cy.get('.fake-link-underlined').click({force: true})
    })
    cy.get('p')
    cy.should('contain', 'Your cat is staying with Accepted1 for 2051-08-04 until 2051-08-08.')
    cy.should('contain', 'The total cost of this stay is 678 kr')
    cy.should('contain', 'Some address in Sthlm')
  })

  it('and see information about cancelled booking', () => {
    cy.get('#view-outgoing-bookings').click()
    cy.get('#6').within(() => {
      cy.get('.fake-link-underlined').click()
    })
    cy.should('contain', 'Your booking got automatically cancelled due to Canceled1 not responding for 3 days. Try to search again, we hope you find a perfect host soon!')
  })
})