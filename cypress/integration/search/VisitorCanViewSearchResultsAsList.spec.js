const api = 'http://localhost:3007/api/v1';

function fetchHostProfiles() {
  cy.server();
  cy.route({
    method: 'GET',
    url: `${api}/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`,
    status: 200,
    response: 'fixture:search_results_list.json',
  });
  cy.route({
    method: 'GET',
    url: `${api}/host_profiles?startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`,
    status: 200,
    response: 'fixture:search_results_list.json',
  });
}

function fetchReviews() {
  cy.route({
    method: 'GET',
    url: `${api}/reviews?host_profile_id=4&locale=en-US`,
    status: 200,
    response: [],
  });
}

function conversationRoutes(id) {
  cy.route({
    method: 'POST',
    url: `${api}/conversations`,
    status: 200,
    response: 'fixture:create_conversation.json',
  });
  cy.route({
    method: 'GET',
    url: `${api}/conversations/2?locale=en-US`,
    status: 200,
    response: 'fixture:no_user_messages.json',
  });
  cy.route({
    method: 'GET',
    url: `${api}/host_profiles?user_id=${id}&locale=en-US`,
    status: 200,
    response: 'fixture:host_profile_datapoint_click_map.json',
  });
}

describe('Visitor can view search results as a list', () => {
  before(() => {
    fetchHostProfiles();
    cy.visit('http://localhost:3000');
    const now = new Date(2019, 9, 1).getTime();
    cy.clock(now);
    cy.get('.twelve > [href="/search"]').click();
    cy.get('.ui > #search-form > .required > #location > .default').click();
    cy.get('.ui > #search-form > .required > #location > .search').type('Stock');
    cy.get('#search-form > .required > #location > .visible > .selected').click();
    cy.get('.ui > #search-form > .required > .ui > #cats').click();
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2');
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true });
    cy.get(
      '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)'
    ).click();
    cy.get(
      '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)'
    )
      .last()
      .click();
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true });
    cy.get('#list-button').click();
  });

  it('and see correct amount of results', () => {
    cy.contains('10 result(s)').should('exist');
  });

  it('and see results sorted after host availability and then host profile score', () => {
    cy.get('div[class="list-card"]').first().should('have.id', '66');
    cy.get('[style="padding: 2rem;"] > :nth-child(2)').should('have.id', '22');
    cy.get('[style="padding: 2rem;"] > :nth-child(3)').should('have.id', '44');
    cy.get('[style="padding: 2rem;"] > :nth-child(4)').should('have.id', '55');
    cy.get('[style="padding: 2rem;"] > :nth-child(7)').should('have.id', '66');
    cy.get('[style="padding: 2rem;"] > :nth-child(8)').should('have.id', '99');
    cy.get('[style="padding: 2rem;"] > :nth-child(9)').should('have.id', '88');
  });

  it('and see specific CSS marking for available and non available hosts', () => {
    cy.get('div[class="list-card"]')
      .first()
      .within(() => {
        cy.get('div[class="available-host"]').should('be.visible');
      });
    cy.get('[style="padding: 2rem;"] > :nth-child(7)').within(() => {
      cy.get('div[class="available-host"]').should('not.exist');
    });
  });

  it('and see correct prices', () => {
    cy.get('#44').should('include.text', '679 kr');
    cy.get('#66').should('include.text', '557.75 kr');
  });

  it('and see the full host profile when clicking on a list card', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles?user_id=44&locale=en-US`,
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json',
    });
    fetchReviews();
    let hostData = [
      ['#nickname', '#description', '#per-day', ':nth-child(10) > #total'],
      ['carla', 'I have the nicest hair in the world! And I love cats btw :P', '169.75 kr/day', '679 kr'],
    ];
    cy.get('#44').click();
    cy.get('#more').click();
    hostData[0].forEach((data) => {
      cy.get(data).should('include.text', hostData[1][hostData[0].indexOf(data)]);
    });
    cy.get('#avatar').should('be.visible');
  });

  it('and send a message to the host only if logged in', () => {
    cy.get('#send-message').click();
    cy.contains('Log in').should('exist');
  });

  it('and gets redirected to relevant route to send a message if they log in', () => {
    fetchHostProfiles();
    conversationRoutes(44);
    fetchReviews();
    cy.route({
      method: 'POST',
      url: `${api}/auth/sign_in`,
      status: 200,
      response: 'fixture:successful_login.json',
      headers: {
        uid: 'george@mail.com',
      },
    });
    cy.get('#email').type('george@mail.com');
    cy.get('#password').type('password');
    cy.get('.submit-button').click();
    cy.get('#44').click();
    cy.get('#more').click();
    cy.get('#send-message').click();
    cy.location('pathname').should('eq', '/conversation');
  });

  it('and see specific text in HostPopup for not available hosts and get redirected to messenger after clicking the link only if logged in', () => {
    fetchHostProfiles();
    conversationRoutes(99);
    cy.go('back');
    cy.get('#99').click();
    cy.contains(
      'This cat sitter have not added information about their availability for the dates you chose. You can still send them a booking request or contact them first to see if they are available.'
    ).should('exist');
    cy.get('#send-message').click({ force: true });
    cy.location('pathname').should('eq', '/conversation');
  });
});
