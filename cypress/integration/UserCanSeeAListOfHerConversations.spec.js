describe('User can see a list of all her conversations', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_conversations.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#messenger-icon').click({ force: true })
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
    cy.get('#5').within(() => {
      cy.contains('Last Christmas')
    })
  })

  it('displayed in correct chronological order (empty conversations are displayed last with relevant message)', () => {
    cy.get('[data-cy=all-messages]').first().contains('elGreco')
    cy.get('[data-cy=all-messages]').last().contains('Christmas')
    cy.get('#4').within(() => {
      cy.contains('No messages')
    })
  })

  it('and see relevant nickname when a user is deleted from the database', () => {
    cy.get('#6').within(() => {
      cy.contains('Deleted user')
    })
  })

  it('and see relevant message if last message was an image attachment', () => {
    cy.get('#7').within(() => {
      cy.contains('Image attachment')
    })
  })
})
