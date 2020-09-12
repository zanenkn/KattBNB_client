describe('User can see messages of individual conversation', () => {

  it('succesfully displayed in correct chronological order', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_conversations.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations/1?locale=en-US',
      status: 200,
      response: 'fixture:user_messages.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#messenger-icon').click({ force: true })
    cy.get('#1').click()
    cy.get('[data-cy=all-messages-individual-conversation]').first().contains('Hello world!!!')
    cy.get('[data-cy=all-messages-individual-conversation]').last().contains('test')
  })

  it('if messages exist, otherwise see a relevant message', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_conversations.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations/1?locale=en-US',
      status: 200,
      response: 'fixture:no_user_messages.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#messenger-icon').click({ force: true })
    cy.get('#1').click()
    cy.contains("You don't have any messages in this conversation (yet).")
  })

  it('and not create a new message cause she enters more than 1000 characters', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_conversations.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations/1?locale=en-US',
      status: 200,
      response: 'fixture:user_messages.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/auth/validate_token',
      status: 200,
      response: ''
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#messenger-icon').click({ force: true })
    cy.get('#1').click()
    cy.get('#newMessage').type('another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!anothe')
    cy.contains('Remaining characters:')
    cy.get('#send').click()
    cy.contains('The message cannot be empty or exceed 1000 characters!')
  })

  it('and not create a new message cause she enters no message', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_conversations.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations/1?locale=en-US',
      status: 200,
      response: 'fixture:user_messages.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/auth/validate_token',
      status: 200,
      response: ''
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#messenger-icon').click({ force: true })
    cy.get('#1').click()
    cy.get('#send').should('not.be.visible')
    cy.get('#newMessage').type('{enter}')
    cy.contains('The message cannot be empty or exceed 1000 characters!')
  })

  it('and delete a conversation', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_conversations.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations/1?locale=en-US',
      status: 200,
      response: 'fixture:user_messages.json'
    })
    cy.route({
      method: 'PATCH',
      url: 'http://localhost:3007/api/v1/conversations/1',
      status: 200,
      response: 'fixture:user_messages.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com',
      status: 200,
      response: 'fixture:validate_token.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#messenger-icon').click({ force: true })
    cy.get('#1').click()
    cy.fixture('all_user_conversations.json').then((all_conversations) => {
      //deletes first conversation
      all_conversations[0].hidden = 1
      cy.route({
        method: 'GET',
        url: 'http://localhost:3007/api/v1/conversations?user_id=1&locale=en-US',
        status: 200,
        response: all_conversations
      })
    })
    cy.get('#delete-conversation').click()
    cy.wait(1000)
    cy.get('#1').should('not.exist')
  })

  it('and can only send a written message or an image, not both at the same time', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:all_user_conversations.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations/1?locale=en-US',
      status: 200,
      response: 'fixture:user_messages.json'
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#messenger-icon').click({ force: true })
    cy.get('#1').click()
    cy.get('#send').should('not.be.visible')
    cy.get('#upload-image').should('be.visible')
    cy.get('#newMessage').type('Hi!')
    cy.get('#send').should('be.visible')
    cy.get('#upload-image').should('not.be.visible')
  })
})
