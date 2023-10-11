const api = 'http://localhost:3007/api/v1';

function fetchHostProfile() {
  cy.server();
  cy.route({
    method: 'GET',
    url: `${api}/host_profiles?user_id=44&locale=en-US`,
    status: 200,
    response: 'fixture:host_profile_datapoint_click_map.json',
  });
}

function fetchResults(url) {
  cy.route({
    method: 'GET',
    url: url,
    status: 200,
    response: 'fixture:search_results_list.json',
  });
}

describe.skip('Visitor can view search results as a map', () => {
  before(() => {
    cy.server();
    cy.visit('http://localhost:3000');
    fetchResults(
      `${api}/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`
    );
    fetchResults(`${api}/host_profiles?startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`);
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
    cy.clock().then((clock) => {
      clock.restore();
    });
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true });
  });

  it('and see datapoints', () => {
    let labels = ['#44', '#55'];
    labels.forEach((label) => {
      cy.get(label).should('be.visible');
    });
  });

  it('and see a popup with host information by clicking on a specific datapoint', () => {
    fetchHostProfile();
    cy.get('#44').click({ force: true });
    let hostData = [
      'carla',
      'Stockholm',
      '169.75 kr/day',
      'The stay for 2 cats with carla during the dates of 2019-10-08 until 2019-10-11 would in total cost',
      '679 kr',
    ];
    hostData.forEach((data) => {
      cy.contains(data).should('exist');
    });
  });

  it("and see the full host profile after clicking 'more' in host popup", () => {
    fetchHostProfile();
    cy.route({
      method: 'GET',
      url: `${api}/reviews?host_profile_id=4&locale=en-US`,
      status: 200,
      response: [],
    });
    let hostData = [
      ['#nickname', '#description', '#per-day', ':nth-child(10) > #total'],
      ['carla', 'I have the nicest hair in the world! And I love cats btw :P', '169.75 kr/day', '679 kr'],
    ];
    cy.get('#more').click();
    hostData[0].forEach((data) => {
      cy.get(data).should('include.text', hostData[1][hostData[0].indexOf(data)]);
    });
    cy.get('#avatar').should('be.visible');
  });
});
