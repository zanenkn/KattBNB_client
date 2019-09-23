describe('Visitor can search for cat sitters on landing page', () => {
  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000/')
  })

  it('and get an error message if number of cats is outside criteria', () => {
    cy.get('#cats').type('-5')
    cy.get('#search-button').click()
    cy.contains('Number of cats must be a whole positive number!')
  })

  it('and get an error message if location is not selected', () => {
    cy.get('#cats').type('1')
    cy.get('#search-button').click()
    cy.contains('You must choose a location to continue!')
  })

  it('and get an error message if check-in and check-out dates are not filled in', () => {
    cy.get('#cats').type('1')
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('#search-form > .required > #location > .visible > .item:nth-child(30)').click()
    cy.get('#search-button').click()
    cy.contains('You must choose both check-in and check-out dates to continue!')
  })

  it('successfully, but there are no matching results', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Dorotea',
      status: 200,
      response: 'fixture:search_no_results.json'
    })
    cy.get('#cats').type('1')
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('#search-form > .required > #location > .visible > .item:nth-child(30)').click()
    cy.get('#search-form > .required > .InputFromTo > .DayPickerInput > input').click()
    cy.get('.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(5) > .DayPicker-Day:nth-child(2)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(6) > .DayPicker-Day:nth-child(3)').click()
    cy.get('#search-button').click()
    cy.contains('Your search did not yield any results! Try changing your search criteria or go to the map to find cat sitters in nearby areas.')
  })
})
