describe('Visitor can view search results', () => {
  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000/')
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Stockholm',
      status: 200,
      response: 'fixture:search_results_list.json'
    })
  })

  it('as a list', () => {
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)').click()
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('.ui > #search-form > .required > #location > .search').type('Stock')
    cy.get('#search-form > .required > #location > .visible > .selected').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2')
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click()
    cy.contains('1 result(s)')
    cy.contains('carla')
    cy.contains('460 kr')
  })
})