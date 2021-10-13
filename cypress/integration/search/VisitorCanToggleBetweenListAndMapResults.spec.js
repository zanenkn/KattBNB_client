const api = 'http://localhost:3007/api/v1';

describe('Visitor can toggle between list and map results', () => {
  before(function () {
    cy.server();
    cy.visit('http://localhost:3000');
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
      .click({ force: true });
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true });
  });

  it('and see map as a default view', () => {
    cy.get('.list-card').should('not.exist');
    cy.get('#map-wrapper').should('be.visible');
  });

  it('and see list view when hitting the relevant button', () => {
    cy.get('#list-button').click();
    cy.wait(1000);
    cy.get('.list-card').should('be.visible');
    cy.get('#map-wrapper').should('not.exist');
  });

  it('and see the map view again when hitting the relevant button', () => {
    cy.get('#map-button').click();
    cy.get('.list-card').should('not.exist');
    cy.get('#map-wrapper').should('be.visible');
  });
});
