import nav from '../../pages/navigation';
import search from '../../pages/search';
import mockAPI from '../../support/api';
import {api} from '../../support/constants'

describe('Search', () => {
  beforeEach(() => {});

  it('successful', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles?location=Dorotea&startDate=1577059200000&endDate=1577750400000&cats=1&locale=en-US`,
      status: 200,
      response: { with: [], without: [] },
    });
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles?startDate=1577059200000&endDate=1577750400000&cats=1&locale=en-US`,
      status: 200,
      response: { with: [], without: [] },
    });
    nav.landing();
    const now = new Date(2019, 11, 1).getTime();
    cy.clock(now);
    nav.to.search();
    search.location().click();
    search.locationOption('Dorotea').click();
    search.fromField().click();
    search.pickDate(`Dec 23, 2019`);
    search.pickDate(`Dec 31, 2019`);
    search.cats().type('1', { force: true });
    search.submit()
    cy.wait(10000)
  });
});

// const api = 'http://localhost:3007/api/v1';

// describe('Visitor can search for cat sitters', () => {
//   it('but cannot navigate manually to the search results path, without first filling the search form', () => {
//     cy.visit('http://localhost:3000/search-results');
//     cy.contains('Find a cat sitter!').should('exist');
//   });

//   it('and gets an error message if number of cats is outside criteria', () => {
//     cy.visit('http://localhost:3000');
//     cy.get('.twelve > [href="/search"]').click();
//     cy.get('#cats').type('-5');
//     cy.get('#search-button').click();
//     cy.contains('Number of cats must be a whole positive number!').should('exist');
//   });

//   it('and gets an error message if location is not selected', () => {
//     cy.get('#cats').clear().type('1');
//     cy.get('#search-button').click();
//     cy.contains('You must choose a location to continue!').should('exist');
//   });

//   it('and gets an error message if check-in and check-out dates are not filled in', () => {
//     cy.get('.ui > #search-form > .required > #location > .default').click();
//     cy.get('#search-form > .required > #location > .visible > .item:nth-child(30)').click();
//     cy.get('#search-button').click();
//     cy.contains('You must choose both check-in and check-out dates to continue!').should('exist');
//   });
// });

// describe('Visitor can search for cat sitters', () => {
//   it('successfully, but there are no matching results - sees a secondary header with all the search criteria selected - gets a relevant message and can click on that message and get redirected and have the search criteria prefilled', () => {
//     cy.server();
//     cy.route({
//       method: 'GET',
//       url: `${api}/host_profiles?location=Dorotea&startDate=1577059200000&endDate=1577750400000&cats=1&locale=en-US`,
//       status: 200,
//       response: { with: [], without: [] },
//     });
//     cy.route({
//       method: 'GET',
//       url: `${api}/host_profiles?startDate=1577059200000&endDate=1577750400000&cats=1&locale=en-US`,
//       status: 200,
//       response: { with: [], without: [] },
//     });
//     cy.visit('http://localhost:3000');
//     const now = new Date(2019, 9, 1).getTime();
//     cy.clock(now);
//     cy.get('.twelve > [href="/search"]').click();
//     cy.get('#cats').type('1');
//     cy.get('.ui > #search-form > .required > #location > .default').click();
//     cy.get('#search-form > .required > #location > .visible > .item:nth-child(30)').click();
//     cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true });
//     cy.get(
//       '.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next'
//     ).click();
//     cy.get(
//       '.DayPickerInput-Overlay > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next'
//     ).click();
//     cy.get(
//       '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(5) > .DayPicker-Day:nth-child(2)'
//     ).click();
//     cy.get(
//       '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(6) > .DayPicker-Day:nth-child(3)'
//     )
//       .last()
//       .click();
//     cy.get('#search-button').click({ force: true });
//     cy.get('#list-button').click();
//     cy.contains('Your search did not yield any results!').should('exist');
//     cy.contains('Dorotea').should('exist');
//     cy.contains('0 result(s)').should('exist');
//     cy.contains('1').should('exist');
//     cy.get(':nth-child(1) > .ui > input').should('have.value', '2019-12-23');
//     cy.get(':nth-child(2) > .ui > input').should('have.value', '2019-12-31');
//     cy.get('.fake-link').click();
//     cy.get(':nth-child(2) > .DayPickerInput > input').should('have.value', 'December 23, 2019');
//     cy.get('[style="margin-top: 0.5em;"] > .DayPickerInput > input').should('have.value', 'December 31, 2019');
//     cy.contains('Dorotea').should('exist');
//     cy.get('#cats').should('have.value', '1');
//   });
// });

// const api = 'http://localhost:3007/api/v1';
// const email = 'george@mail.com';

// describe('User cannot see their profile in the results', () => {
//   it('if logged in', () => {
//     cy.server();
//     cy.visit('http://localhost:3000/');
//     cy.route({
//       method: 'GET',
//       url: `${api}/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`,
//       status: 200,
//       response: 'fixture:search_results_list.json',
//     });
//     cy.route({
//       method: 'POST',
//       url: `${api}/auth/sign_in`,
//       status: 200,
//       response: 'fixture:successful_login.json',
//       headers: {
//         uid: email,
//       },
//     });
//     cy.route({
//       method: 'GET',
//       url: `${api}/host_profiles?startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`,
//       status: 200,
//       response: '',
//       headers: {
//         uid: email,
//       },
//     });
//     cy.get('.twelve > [href="/search"]').click();
//     const now = new Date(2019, 9, 1).getTime();
//     cy.clock(now);
//     cy.get('.hamburger-box').click();
//     cy.get('#login').click();
//     cy.get('#login-form').within(() => {
//       cy.get('#email').type(email);
//       cy.get('#password').type('password');
//     });
//     cy.get('.submit-button').click();
//     cy.get('.ui > #search-form > .required > .ui > #cats').click();
//     cy.get('.ui > #search-form > .required > .ui > #cats').type('2');
//     cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true });
//     cy.get(
//       '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)'
//     ).click();
//     cy.get(
//       '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)'
//     )
//       .last()
//       .click();
//     cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true });
//     cy.contains('8 result(s)').should('exist');
//     cy.get('#66').should('not.exist');
//   });
// });

// const api = 'http://localhost:3007/api/v1';

// describe('Visitor can toggle between list and map results', () => {
//   before(function () {
//     cy.server();
//     cy.visit('http://localhost:3000');
//     cy.route({
//       method: 'GET',
//       url: `${api}/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`,
//       status: 200,
//       response: 'fixture:search_results_list.json',
//     });
//     cy.route({
//       method: 'GET',
//       url: `${api}/host_profiles?startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`,
//       status: 200,
//       response: 'fixture:search_results_list.json',
//     });
//     const now = new Date(2019, 9, 1).getTime();
//     cy.clock(now);
//     cy.get('.twelve > [href="/search"]').click();
//     cy.get('.ui > #search-form > .required > #location > .default').click();
//     cy.get('.ui > #search-form > .required > #location > .search').type('Stock');
//     cy.get('#search-form > .required > #location > .visible > .selected').click();
//     cy.get('.ui > #search-form > .required > .ui > #cats').click();
//     cy.get('.ui > #search-form > .required > .ui > #cats').type('2');
//     cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true });
//     cy.get(
//       '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)'
//     ).click();
//     cy.get(
//       '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)'
//     )
//       .last()
//       .click({ force: true });
//     cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true });
//   });

//   it('and see map as a default view', () => {
//     cy.get('.list-card').should('not.exist');
//     cy.get('#map-wrapper').should('be.visible');
//   });

//   it('and see list view when hitting the relevant button', () => {
//     cy.get('#list-button').click();
//     cy.wait(1000);
//     cy.get('.list-card').should('be.visible');
//     cy.get('#map-wrapper').should('not.exist');
//   });

//   it('and see the map view again when hitting the relevant button', () => {
//     cy.get('#map-button').click();
//     cy.get('.list-card').should('not.exist');
//     cy.get('#map-wrapper').should('be.visible');
//   });
// });
