describe('User can see messages of individual conversation', () => {

  it('succesfully displayed in correct chronological order', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1',
      status: 200,
      response: 'fixture:all_user_conversations.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations/1',
      status: 200,
      response: 'fixture:user_messages.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#messenger-icon').click()
    })
    cy.get('#1').click()
    cy.get('[data-cy=all-messages-individual-conversation]').first().contains('Hello world!!!')
    cy.get('[data-cy=all-messages-individual-conversation]').last().contains('test')
  })

  it('and create a new message which is displayed after page reload', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1',
      status: 200,
      response: 'fixture:all_user_conversations.json'
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/conversations/1/messages',
      status: 200,
      response: ''
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com',
      status: 200,
      response: 'fixture:validate_token.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#messenger-icon').click()
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations/1',
      status: 200,
      response: 'fixture:user_messages.json'
    })
    cy.get('#1').click()
    cy.get('[data-cy=all-messages-individual-conversation]').last().contains('test')
    cy.get('#newMessage').type('another test!')
    cy.get('#send').click()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations/1',
      status: 200,
      response: 'fixture:user_messages_new.json'
    })
    cy.wait(1000)
    cy.get('[data-cy=all-messages-individual-conversation]').last().contains('another test')
  })
})
