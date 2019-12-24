describe('User can see a list of all her conversations', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1',
      status: 200,
      response: 'fixture:all_user_conversations.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#messenger-icon').click()
    })
  })

  it('succesfully', () => {
    cy.contains('Messages')
    cy.get('#1').within(() => {
      cy.contains('carla')
    })
    cy.get('#2').within(() => {
      cy.contains('elGreco')
    })
    cy.get('#3').within(() => {
      cy.contains('steffe')
    })
    cy.get('#4').within(() => {
      cy.contains('Christmas')
    })
  })

  it('displayed in correct chronological order (empty conversations are displayed last with relevant message)', () => {
    cy.get('[data-cy=all-messages]').first().contains('elGreco')
    cy.get('[data-cy=all-messages]').last().contains('Christmas')
    cy.get('#4').within(() => {
      cy.contains('No messages')
    })
  })
})
