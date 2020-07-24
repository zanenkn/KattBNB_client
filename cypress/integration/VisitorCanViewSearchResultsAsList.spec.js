describe('Visitor can view search results as a list', () => {
  before(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US',
      status: 200,
      response: 'fixture:search_results_list_2.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US',
      status: 200,
      response: ''
    })
    cy.visit('http://localhost:3000/')
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('.ui > #search-form > .required > #location > .search').type('Stock')
    cy.get('#search-form > .required > #location > .visible > .selected').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2')
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)').last().click()
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true })
  })

  it('and see correct amount of results', () => {
    cy.contains('3 result(s)')
  })

  it('and see results sorted after host profile score', () => {
    cy.get('div[class="list-card"]').first().should('have.id', '66')
    cy.get('div[class="list-card"]').last().should('have.id', '33')
  })

  it('and see correct prices', () => {
    cy.get('#22').within(() => {
      cy.contains('560 kr')
    })

    cy.get('#33').within(() => {
      cy.contains('460 kr')
    })
  })

  it('and not see hosts that are not available', () => {
    cy.get('#44').should('not.exist')
    cy.get('#55').should('not.exist')
  })

  it('and not see hosts that does not accept required amount of cats', () => {
    cy.get('#11').should('not.exist')
  })

  it('and see the full host profile when clicking on a list card', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=2&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json'
    })
    let hostData = [
      [
        '#nickname', '#description', '#per-day',
        '#per-day'
      ],
      ['carla', 'I have the nicest hair in the world! And I love cats btw :P', '140 kr/day', '560 kr']
    ]
    cy.get('img#2.ui.image').click({ force: true })
    cy.get('#more').click()

    hostData[0].forEach(data => {
      cy.get(data).contains(hostData[1][hostData[0].indexOf(data)])
    })

    cy.get('#avatar').should('be.visible')
  })

  it('and send a message to the host only if she is logged in', () => {
    cy.server()
    cy.visit('http://localhost:3000/')
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US',
      status: 200,
      response: 'fixture:search_results_list_2.json'
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
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('.ui > #search-form > .required > #location > .search').type('Stock')
    cy.get('#search-form > .required > #location > .visible > .selected').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2')
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)').last().click()
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=2&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json'
    })
    cy.get('img#2.ui.image').click({ force: true })
    cy.get('#more').click()
    cy.get('#send-message').click()
    cy.contains('Log in')
  })

  it('and gets redirected to relevant route to send a message if she is logged in', () => {
    cy.server()
    cy.visit('http://localhost:3000/')
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US',
      status: 200,
      response: 'fixture:search_results_list_2.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US',
      status: 200,
      response: ''
    })
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('.ui > #search-form > .required > #location > .search').type('Stock')
    cy.get('#search-form > .required > #location > .visible > .selected').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2')
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)').last().click()
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true })
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=2&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/reviews?host_profile_id=2&locale=en-US',
      status: 200,
      response: []
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
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/conversations',
      status: 200,
      response: 'fixture:create_conversation.json'
    })
    cy.get('img#2.ui.image').click({ force: true })
    cy.get('#more').click()
    cy.get('#send-message').click()
    cy.get('#email').type('george@mail.com')
    cy.get('#password').type('password')
    cy.get('.submit-button').click()
    cy.get('img#2.ui.image').click({ force: true })
    cy.get('#more').click()
    cy.get('#send-message').click()
    cy.location('pathname').should('eq', '/conversation')
  })
})
