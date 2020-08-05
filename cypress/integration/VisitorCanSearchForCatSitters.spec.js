describe('Visitor can search for cat sitters on landing page', () => {
  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000/search')
  })

  it('and gets an error message if number of cats is outside criteria', () => {
    cy.get('#cats').type('-5')
    cy.get('#search-button').click()
    cy.contains('Number of cats must be a whole positive number!')
  })

  it('and gets an error message if location is not selected', () => {
    cy.get('#cats').type('1')
    cy.get('#search-button').click()
    cy.contains('You must choose a location to continue!')
  })

  it('and gets an error message if check-in and check-out dates are not filled in', () => {
    cy.get('#cats').type('1')
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('#search-form > .required > #location > .visible > .item:nth-child(30)').click()
    cy.get('#search-button').click()
    cy.contains('You must choose both check-in and check-out dates to continue!')
  })

  it('successfully, but there are no matching results and she gets a relevant message', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Dorotea&startDate=1577059200000&endDate=1577750400000&cats=1&locale=en-US',
      status: 200,
      response: 'fixture:search_no_results.json'
    })
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.get('#cats').type('1')
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('#search-form > .required > #location > .visible > .item:nth-child(30)').click()
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(5) > .DayPicker-Day:nth-child(2)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(6) > .DayPicker-Day:nth-child(3)').last().click()
    cy.get('#search-button').click({ force: true })
    cy.contains('Your search did not yield any results!')
  })

  it('successfully and can click on no matching results relevant message, get redirected and have the search criteria prefilled', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Dorotea&startDate=1577059200000&endDate=1577750400000&cats=1&locale=en-US',
      status: 200,
      response: 'fixture:search_no_results.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?startDate=1577059200000&endDate=1577750400000&cats=1&locale=en-US',
      status: 200,
      response: ''
    })
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.get('#cats').type('1')
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('#search-form > .required > #location > .visible > .item:nth-child(30)').click()
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(5) > .DayPicker-Day:nth-child(2)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(6) > .DayPicker-Day:nth-child(3)').last().click()
    cy.get('#search-button').click({ force: true })
    cy.get('.fake-link').click()
    cy.get(':nth-child(2) > .DayPickerInput > input').should('have.value', 'December 23, 2019')
    cy.get('[style="margin-top: 0.5em;"] > .DayPickerInput > input').should('have.value', 'December 31, 2019')
    cy.contains('Dorotea')
    cy.get('#cats').should('have.value', '1')
  })

  it('but cannot navigate manually to the search results path, without first filling the search form', () => {
    cy.visit('http://localhost:3000/search-results')
    cy.contains('Find a cat sitter!')
  })

  it('and sees a secondary header with all the search criteria she selected', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Dorotea&startDate=1577059200000&endDate=1577750400000&cats=15&locale=en-US',
      status: 200,
      response: 'fixture:search_no_results.json'
    })
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.get('#cats').type('15')
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('#search-form > .required > #location > .visible > .item:nth-child(30)').click()
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(5) > .DayPicker-Day:nth-child(2)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(6) > .DayPicker-Day:nth-child(3)').last().click()
    cy.get('#search-button').click({ force: true })
    cy.contains('Dorotea')
    cy.contains('0 result(s)')
    cy.contains('15')
    cy.get(':nth-child(1) > .ui > input').should('have.value', '2019-12-23')
    cy.get(':nth-child(2) > .ui > input').should('have.value', '2019-12-31')
  })
})
