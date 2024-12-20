const api = 'http://localhost:3007/api/v1';

function fetchUserBookings() {
  cy.server();
  cy.route({
    method: 'GET',
    url: `${api}/bookings?stats=yes&user_id=66&host_nickname=GeorgeTheGreek&locale=en-US`,
    status: 200,
    response: 'fixture:booking_stats_0.json',
  });
}

describe('User can view 0 outgoing or incoming bookings', () => {
  before(function () {
    fetchUserBookings();
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.get('#bookings-icon').click({ force: true });
  });

  it('and see relevant message if there are no outgoing bookings stored in the database', () => {
    cy.get('.content-wrapper > :nth-child(3)').should(
      'include.text',
      "Need someone to take care of your cat while you're away?"
    );
  });

  it('and see relevant message if there are no incoming bookings stored in the database', () => {
    cy.get('.content-wrapper > :nth-child(4)').should(
      'include.text',
      'Wanna take care of cats and make a bit of money?'
    );
  });

  it("and get redirected to the main page when clicking on 'Search and book' link", () => {
    cy.get('#view-outgoing-bookings').click();
    cy.contains('Find a cat sitter!').should('exist');
  });

  it("and get redirected to the FAQ page when clicking on 'Become a host' link", () => {
    fetchUserBookings();
    cy.go('back');
    cy.get('#view-incoming-bookings').click();
    cy.contains('FAQ').should('exist');
  });
});
