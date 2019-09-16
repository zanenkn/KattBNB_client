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
    cy.get('#search-form > .ui > #search-form > #location > .dropdown').click()
    cy.get('#search-button').click()
    cy.contains('You must choose both check-in and check-out dates to continue!')
  })

  it('and get an error message if check-in date is later than check-out date', () => {
    cy.get('#cats').type('1')
    cy.get('#search-form > .ui > #search-form > #location > .dropdown').click()
    cy.get('.ui > #search-form > #location > .visible > .item:nth-child(2)').click()
    cy.get('.ui > #search-form > .equal > div:nth-child(1) > div').click()
    cy.get('div > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation').click()
    cy.get('div > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation--next').click()
    cy.get('div > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation--next').click()
    cy.get('.react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--022').click()
    cy.get('#search-form > .ui > #search-form > .equal > div:nth-child(2)').click()
    cy.get('.react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--025').click()
    cy.get('.equal > div > div > .react-datepicker__input-container > .react-datepicker__close-icon').click()
    cy.get('.ui > #search-form > .equal > div:nth-child(1) > div').click()
    cy.get('div > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation').click()
    cy.get('div > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation--next').click()
    cy.get('div > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation--next').click()
    cy.get('.react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--029').click()
    cy.get('#search-button').click()
    cy.contains('Check-out date cannot be earlier than check-in date!')
  })

  it('successfully, but there are no matching results', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?location=Ale',
      status: 200,
      response: 'fixture:search_no_results.json'
    })
    cy.get('#cats').type('1')
    cy.get('#search-form > .ui > #search-form > #location > .dropdown').click()
    cy.get('.ui > #search-form > #location > .visible > .selected').click()
    cy.get('.ui > #search-form > .equal > div:nth-child(1) > div').click()
    cy.get('div > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation').click()
    cy.get('div > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation--next').click()
    cy.get('div > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation--next').click()
    cy.get('.react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--029').click()
    cy.get('#search-form > .ui > #search-form > .equal > div:nth-child(2)').click()
    cy.get('.react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week:nth-child(5) > .react-datepicker__day--004').click()
    cy.get('#search-button').click()
    cy.contains('Your search did not yield any results! Try changing your search criteria or go to the map to find cat sitters in nearby areas.')
  })
})
