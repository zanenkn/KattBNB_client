describe('User cannot see a list of conversations', () => {
  it('cause of 0 messages', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations?user_id=66&locale=en-US',
      status: 200,
      response: [],
    });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.get('#messenger-icon').click({ force: true });
    cy.contains("You don't have any messages (yet).");
  });
});
