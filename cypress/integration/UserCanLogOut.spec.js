describe('User can sign out', () => {

  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000')
  })

  it('successfully', () => {
    cy.route({
      method: 'DELETE',
      url: 'http://localhost:3007/api/v1/auth/sign_out',
      status: 200,
      response: 'fixture:successful_signout.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(1000)
    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
    cy.get('#logout').click()
    cy.wait(1000)
    cy.contains('Log in')
  })
})
