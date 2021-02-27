function getElement(id, text) {
  cy.get(id).within(() => {
    cy.contains(text);
  });
}

describe('User can see a list of all their conversations', () => {
  before(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=66&locale=en-US',
      status: 200,
      response: 'fixture:all_user_conversations.json',
    });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.get('#messenger-icon').click({ force: true });
  });

  it('succesfully', () => {
    cy.contains('Messages');
    getElement('#1', 'carla');
    getElement('#2', 'elGreco');
    getElement('#3', 'steffe');
    getElement('#4', 'Christmas');
    getElement('#5', 'Last Christmas');
  });

  it('displayed in correct chronological order (empty conversations are displayed last with relevant message)', () => {
    cy.get('[data-cy=all-messages]').first().contains('elGreco');
    cy.get('[data-cy=all-messages]').last().contains('Christmas');
    getElement('#4', 'No messages');
  });

  it('and see relevant nickname when a user is deleted from the database', () => {
    getElement('#6', 'Deleted user');
  });

  it('and see relevant message if last message was an image attachment', () => {
    getElement('#7', 'Image attachment');
  });
});
