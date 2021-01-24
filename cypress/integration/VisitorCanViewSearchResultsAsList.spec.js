describe('Visitor can view search results as a list', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url:
        'http://localhost:3007/api/v1/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US',
      status: 200,
      response: 'fixture:search_results_list.json',
    });
    cy.route({
      method: 'GET',
      url:
        'http://localhost:3007/api/v1/host_profiles?startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US',
      status: 200,
      response: 'fixture:search_results_list.json',
    });
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/reviews?host_profile_id=2&locale=en-US',
      status: 200,
      response: '',
    });
    cy.visit('http://localhost:3000');
    const now = new Date(2019, 9, 1).getTime();
    cy.clock(now);
    cy.get('.landing-desktop-content > [style="width: 165px;"] > [href="/search"] > .ui').click();
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
    cy.contains('10 result(s)');
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

  it('and see specific CSS marking for available and not available hosts', () => {
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
    cy.get('#44').within(() => {
      cy.contains('679 kr');
    });
    cy.get('#66').within(() => {
      cy.contains('557.75 kr');
    });
  });

  it('and see the full host profile when clicking on a list card', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=44&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json',
    });
    let hostData = [
      ['#nickname', '#description', '#per-day', ':nth-child(10) > #total'],
      ['carla', 'I have the nicest hair in the world! And I love cats btw :P', '169.75 kr/day', '679 kr'],
    ];
    cy.get('#44').click();
    cy.get('#more').click();
    hostData[0].forEach((data) => {
      cy.get(data).contains(hostData[1][hostData[0].indexOf(data)]);
    });
    cy.get('#avatar').should('be.visible');
  });

  it('and send a message to the host only if she is logged in', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=44&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json',
    });

    cy.get('#44').click();
    cy.get('#more').click();
    cy.get('#send-message').click();
    cy.contains('Log in');
  });

  it('and gets redirected to relevant route to send a message if she is logged in', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=44&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json',
    });
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/reviews?host_profile_id=4&locale=en-US',
      status: 200,
      response: [],
    });
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/auth/sign_in',
      status: 200,
      response: 'fixture:successful_login.json',
      headers: {
        uid: 'george@mail.com',
      },
    });
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/conversations',
      status: 200,
      response: 'fixture:create_conversation.json',
    });
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/reviews?host_profile_id=4&locale=en-US',
      status: 200,
      response: [],
    });
    cy.get('#44').click();
    cy.get('#more').click();
    cy.get('#send-message').click();
    cy.get('#email').type('george@mail.com');
    cy.get('#password').type('password');
    cy.get('.submit-button').click();
    cy.get('#44').click();
    cy.get('#more').click();
    cy.get('#send-message').click();
    cy.location('pathname').should('eq', '/conversation');
  });

  it('and see specific text in HostPopup for not available hosts and get redirected to messenger after clicking the link and logging in', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/auth/sign_in',
      status: 200,
      response: 'fixture:successful_login.json',
      headers: {
        uid: 'george@mail.com',
      },
    });
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/conversations',
      status: 200,
      response: 'fixture:create_conversation.json',
    });
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/conversations/2?locale=en-US',
      status: 200,
      response: 'fixture:no_user_messages.json',
    });
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=99&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json',
    });

    cy.get('#99').click();
    cy.contains(
      'This cat sitter have not added information about their availability for the dates you chose. You can still send them a booking request or contact them first to see if they are available.'
    );
    cy.get('#send-message').click({ force: true });
    cy.get('#email').type('george@mail.com');
    cy.get('#password').type('password');
    cy.get('.submit-button').click();
    cy.get('#99').click();
    cy.get('#send-message').click({ force: true });
    cy.location('pathname').should('eq', '/conversation');
  });
});
