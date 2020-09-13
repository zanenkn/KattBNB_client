describe('User cannot see a list of conversations', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1&locale=en-US',
      status: 200,
      response: []
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#messenger-icon').click({force: true})
  })

  it('cause she has no messages', () => {
    cy.contains("You don't have any messages (yet).")
  })
})
