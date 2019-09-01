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
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#user-icon').click()
    })
  })

  it('and get an error message on description update if update criteria are not met', () => {
    cy.get('#change-description-link').click()
    cy.get('#description-submit-button').click()
    cy.contains('The field is blank or unchanged!')
  })

  it('and get an error message on max cats accepted update if update criteria are not met', () => {
    cy.get('#change-maxCats-link').click()
    cy.get('#maxCats-submit-button').click()
    cy.contains('The field is blank, unchanged or the number is invalid!')
  })

  it('and get an error message on daily rate update if update criteria are not met', () => {
    cy.get('#change-rate-link').click()
    cy.get('#rate-submit-button').click()
    cy.contains('The field is blank, unchanged or the number is invalid!')
  })

  it('and get an error message on supplement update if update criteria are not met', () => {
    cy.get('#change-supplement-link').click()
    cy.get('#supplement-submit-button').click()
    cy.contains('The field is blank, unchanged or the number is invalid!')
  })
})
