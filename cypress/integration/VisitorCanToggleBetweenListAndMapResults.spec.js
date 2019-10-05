describe('Visitor can toggle between list and map results', () => {
  before(function () {
    cy.server()
    cy.visit('http://localhost:3000/')
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Stockholm',
      status: 200,
      response: 'fixture:search_results_list.json'
    })
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)').click()
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('.ui > #search-form > .required > #location > .search').type('Stock')
    cy.get('#search-form > .required > #location > .visible > .selected').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2')
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click()
  })

  it('and see list as a default view', () => {
    cy.get('.list-card').should('be.visible')
    cy.get('#map').should('not.exist')
  })

  it('and see map view when she hits the relevant button', () => {
    cy.get('#map-button').click()
    cy.get('.list-card').should('not.exist')
    cy.get('#map').should('be.visible')
  })

  it('and see the list view again when she hits the relevant button', () => {
    cy.get('#list-button').click()
    cy.get('.list-card').should('be.visible')
    cy.get('#map').should('not.exist')
  })
})
