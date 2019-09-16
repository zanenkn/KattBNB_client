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
    cy.get('.content-wrapper > #search-form > #search-form > #location > .dropdown').click()
    cy.get('#search-button').click()
    cy.contains('You must choose both check-in and check-out dates to continue!')
  })

  it('and get an error message if check-in date is later than check-out date', () => {
    cy.get('#cats').type('1')
    cy.get('.content-wrapper > #search-form > #search-form > #location > .dropdown').click()
    cy.get('#search-form > #search-form > #location > .visible > .item:nth-child(2)').click()
    cy.get('.content-wrapper > #search-form > #search-form > .equal > div:nth-child(1)').click()
    cy.get('.equal > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation').click()
    cy.get('.equal > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation--next').click()
    cy.get('.equal > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation--next').click()
    cy.get('.react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--022').click()
    cy.get('.content-wrapper > #search-form > #search-form > .equal > div:nth-child(2)').click()
    cy.get('.react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--025').click()
    cy.get('#search-form > .equal > div:nth-child(1) > .react-datepicker__input-container > .react-datepicker__close-icon').click()
    cy.get('.content-wrapper > #search-form > #search-form > .equal > div:nth-child(1)').click()
    cy.get('.equal > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation').click()
    cy.get('.equal > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation--next').click()
    cy.get('.equal > div > .react-datepicker__portal > .react-datepicker > .react-datepicker__navigation--next').click()
    cy.get('.react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--029').click()
    cy.get('#search-button').click()
    cy.contains('Check-out date cannot be earlier than check-in date!')
  })
})
