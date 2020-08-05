describe('User cannot create a booking request', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US',
      status: 200,
      response: 'fixture:search_results_list.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=2&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US',
      status: 200,
      response: ''
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/reviews?host_profile_id=2&locale=en-US',
      status: 200,
      response: []
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/bookings',
      status: 422,
      response: 'fixture:unsuccessful_booking_creation.json'
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/auth/sign_in',
      status: 200,
      response: 'fixture:successful_login.json',
      headers: {
        'uid': 'george@mail.com',
      }
    })
    cy.visit('http://localhost:3000/search')
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.get('.hamburger-box').click()
    cy.get('#login').click()
    cy.get('#login-form').within(() => {
      cy.get('#email').type('george@mail.com')
      cy.get('#password').type('password')
    })
    cy.get('.submit-button').click()
    cy.wait(2000)
    cy.get('.ui > #search-form > .required > .ui > #cats').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2')
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)').last().click()
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true })
  })

  it('because another user booked the host', () => {
    cy.get('#22').click()
    cy.get('#more').click()
    cy.get('#request-to-book').click()
    cy.get('#message').type('Please take my cats for 4 days!')
    cy.get('#request-to-book-button').click()
    cy.contains('Someone else just booked these days with this host!')
  })
})
