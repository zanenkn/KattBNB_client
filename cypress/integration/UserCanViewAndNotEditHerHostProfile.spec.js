describe('User can view her host profile', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=1',
      status: 200,
      response: 'fixture:host_profile_index.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles/1',
      status: 200,
      response: 'fixture:host_profile_individual.json'
    })
    cy.route({
      method: 'GET',
      url: 'https://maps.google.com/maps/api/geocode/json?address=charles%20de%20gaulle%20airport&key=AIzaSyBocaDJSR80uzUcSvWfciq6at2729MC7kM',
      status: 200,
      response: 'fixture:successful_address_search2.json'
    })
    cy.route({
      method: 'DELETE',
      url: 'http://localhost:3007/api/v1/auth/sign_out',
      status: 200,
      response: 'fixture:successful_signout.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#user-icon').click({ force: true })
  })

  it('and get an error message on description update if update criteria are not met', () => {
    cy.get('#editDescriptionForm').click()
    cy.get('#description-submit-button').click()
    cy.contains('The field is blank or unchanged!')
  })

  it('and get an error message on max cats accepted update if update criteria are not met', () => {
    cy.get('#editMaxCatsForm').click()
    cy.get('#maxCats-submit-button').click()
    cy.contains('The field is blank, unchanged or the number is invalid!')
  })

  it('and get an error message on daily rate update if update criteria are not met', () => {
    cy.get('#editRateForm').click()
    cy.get('#rate-submit-button').click()
    cy.contains('The field is blank, unchanged or the number is invalid!')
  })

  it('and get an error message on supplement update if update criteria are not met', () => {
    cy.get('#editSupplementForm').click()
    cy.get('#supplement-submit-button').click()
    cy.contains('The field is blank, unchanged or the number is invalid!')
  })

  it('and get an error message on availability update if update criteria are not met', () => {
    cy.get('#editableCalendar').click()
    cy.get('#availability-submit-button').click()
    cy.contains('There were no changes made in your availability!')
  })

  it('and get an error message on address update if update criteria are not met', () => {
    cy.get('#editAddress').click()
    cy.get('#address-submit-button').click()
    cy.contains('You have typed the same address or the field is empty!')
  })

  it('and get an error message on avatar update if update criteria are not met', () => {
    cy.get('#add-avatar').click()
    cy.get('#avatar-submit-button').click()
    cy.contains('You have selected no avatar')
  })

  it('and if she logs out and visits the user-page path manually, she gets an error message', () => {
    cy.get('.hamburger-box').click()
    cy.get('#logout')
    cy.wait(2000)
    cy.visit('http://localhost:3000/user-page')
    cy.contains("Don't be a stranger. You need to log in to view this section!")
  })
})
