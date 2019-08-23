describe('User can create a host profile', () => {
  beforeEach(function () {
    cy.server()
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#user-icon').click()
    })
  })
  it('successfully', () => {
    cy.contains('You are not registered as a cat host and do not appear in the search. If you would like to host cats, please create a host profile.')
    cy.get('#create-host-profile-button').click()
    cy.get('#host-profile-form').within(() => {

      let text = [
        ['#description', 'I hate people but I love cats! Nerd life chose me!'],
        ['#rate', '100'],
        ['#max_cats', '3'],
        ['#supplement', '35']
      ]

      text.forEach(element => {
        cy.get(element[0]).type(element[1])
      })
    })

    cy.get('#address').type('Solståndsgatan 22')
    cy.get('#search').click()
    cy.get('#save-host-profile-button').click()
    cy.contains('Your host profile')
  })
})