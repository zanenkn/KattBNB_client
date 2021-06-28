const api = 'http://localhost:3007/api/v1';

function getAllUserConversations(messages) {
  cy.server();
  cy.route({
    method: 'GET',
    url: `${api}/conversations?user_id=66&locale=en-US`,
    status: 200,
    response: 'fixture:all_user_conversations.json',
  });
  if (messages === 'yes') {
    cy.route({
      method: 'GET',
      url: `${api}/conversations/1?locale=en-US`,
      status: 200,
      response: 'fixture:user_messages.json',
    });
  } else {
    cy.route({
      method: 'GET',
      url: `${api}/conversations/1?locale=en-US`,
      status: 200,
      response: 'fixture:no_user_messages.json',
    });
  }
}

function validateToken() {
  cy.server();
  cy.route({
    method: 'GET',
    url: `${api}/auth/validate_token`,
    status: 200,
    response: 'fixture:validate_token.json',
  });
}

describe('User can see messages of individual conversation', () => {
  it('succesfully displayed in correct chronological order', () => {
    getAllUserConversations('yes');
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.get('#messenger-icon').click({ force: true });
    cy.get('#1').click();
    cy.get('[data-cy=all-messages-individual-conversation]').first().should('include.text', 'Hello world!!!');
    cy.get('[data-cy=all-messages-individual-conversation]').last().should('include.text', 'test');
  });

  it('and not create a new message cause she enters more than 1000 characters', () => {
    validateToken();
    cy.get('#newMessage').type(
      'another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!another test!anothe'
    );
    cy.contains('Remaining characters:').should('exist');
    cy.get('#send').click();
    cy.contains('The message cannot be empty or exceed 1000 characters!').should('exist');
  });

  it('and not create a new message cause she enters no message', () => {
    validateToken();
    cy.get('#newMessage').clear();
    cy.get('#send').should('not.be.visible');
    cy.get('#newMessage').type('{enter}');
    cy.contains('The message cannot be empty or exceed 1000 characters!').should('exist');
  });

  it('and not create a new message cause she enters a phone number', () => {
    validateToken();
    cy.get('#newMessage').clear();
    cy.get('#newMessage').type('Call me maybe: 0708988086');
    cy.get('#newMessage').type('{enter}');
    cy.contains(
      'Please do not share private information like phone numbers or email addresses on our messenger as that is against our Terms and Conditions.'
    ).should('exist');
  });

  it('and not create a new message cause she enters an email', () => {
    validateToken();
    cy.get('#newMessage').clear();
    cy.get('#newMessage').type('Haj, email me on zane@mail.com');
    cy.get('#newMessage').type('{enter}');
    cy.contains(
      'Please do not share private information like phone numbers or email addresses on our messenger as that is against our Terms and Conditions.'
    ).should('exist');
  });

  it('and can only send a written message or an image, not both at the same time', () => {
    cy.get('#newMessage').clear();
    cy.get('#send').should('not.be.visible');
    cy.get('#upload-image').should('be.visible');
    cy.get('#newMessage').type('Hi!');
    cy.get('#send').should('be.visible');
    cy.get('#upload-image').should('not.be.visible');
  });

  it('and delete a conversation', () => {
    getAllUserConversations('yes');
    cy.route({
      method: 'PATCH',
      url: `${api}/conversations/1`,
      status: 200,
      response: 'fixture:user_messages.json',
    });
    cy.route({
      method: 'GET',
      url: `${api}/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com`,
      status: 200,
      response: 'fixture:validate_token.json',
    });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.get('#messenger-icon').click({ force: true });
    cy.get('#1').click();
    cy.fixture('all_user_conversations.json').then((all_conversations) => {
      //deletes first conversation
      all_conversations[0].hidden = 66;
      cy.route({
        method: 'GET',
        url: `${api}/conversations?user_id=66&locale=en-US`,
        status: 200,
        response: all_conversations,
      });
    });
    cy.get('#delete-conversation').click();
    cy.get('#1').should('not.exist');
  });

  it('if messages exist, otherwise see a relevant message', () => {
    getAllUserConversations('no');
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.get('#messenger-icon').click({ force: true });
    cy.get('#1').click();
    cy.contains("You don't have any messages in this conversation (yet).").should('exist');
  });
});
