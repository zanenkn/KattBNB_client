describe('User cannot see a list of conversations', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1',
      status: 200,
      response: 'fixture:search_no_results.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#messenger-icon').click()
    })
  })

  it('cause she has no messages', () => {
    cy.contains("You don't have any messages (yet).")
  })
})
