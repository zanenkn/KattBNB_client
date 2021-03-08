const api = 'http://localhost:3007/api/v1';
const email = 'george@mail.com';

describe('User cannot see their profile in the results', () => {
  it('if logged in', () => {
    cy.server();
    cy.visit('http://localhost:3000/');
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`,
      status: 200,
      response: 'fixture:search_results_list.json',
    });
    cy.route({
      method: 'POST',
      url: `${api}/auth/sign_in`,
      status: 200,
      response: 'fixture:successful_login.json',
      headers: {
        uid: email,
      },
    });
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles?startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`,
      status: 200,
      response: '',
      headers: {
        uid: email,
      },
    });
    cy.get('.twelve > [href="/search"]').click();
    const now = new Date(2019, 9, 1).getTime();
    cy.clock(now);
    cy.get('.hamburger-box').click();
    cy.get('#login').click();
    cy.get('#login-form').within(() => {
      cy.get('#email').type(email);
      cy.get('#password').type('password');
    });
    cy.get('.submit-button').click();
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
    cy.contains('8 result(s)').should('exist');
    cy.get('#66').should('not.exist');
  });
});
