import nav from '../../pages/navigation';
import search from '../../pages/search';
import searchResults, { list, map } from '../../pages/searchResults';
import mockAPI from '../../support/api';
import moment from 'moment';

const errors = {
  cats: 'Number of cats must be a whole positive number!',
  location: 'You must choose a location to continue!',
  dates: 'You must choose both check-in and check-out dates to continue!',
};

describe('Visitor can search for cat sitters', () => {
  it('successfully', () => {
    const dateFrom = 'Oct 2, 2019';
    const dateTo = 'Oct 9, 2019';
    const cats = 2;
    const location = 'Stockholm';

    mockAPI.search({
      from: dateFrom,
      to: dateTo,
      cats: cats,
      location: location,
      resultsPerLocation: 'search/results_in_stockholm.json',
    });

    cy.clock(new Date(2019, 9, 1).getTime(), ['Date']);
    nav.search();

    search.fromField().click();
    search.pickDate(dateFrom);
    search.pickDate(dateTo);
    search.location().click();
    search.locationOption(location).click();
    search.cats().type(cats, { force: true });
    search.submit();

    searchResults
      .dates()
      .should('exist')
      .and('have.text', `${moment(dateFrom).format('LL')} - ${moment(dateTo).format('LL')}`);
    searchResults.cats().should('exist').and('have.text', cats);
    searchResults.location().should('exist').and('have.text', location);
    searchResults.resultCount().should('exist').and('have.text', '5 result(s)');
    map.wrapper().should('exist');

    searchResults.listView().click();
    list.wrapper().should('exist');

    searchResults.back().click();
    cy.location('pathname').should('eq', '/search');
    search.datePicker.from().should('have.value', `${moment(dateFrom).format('LL')}`);
    search.datePicker.to().should('have.value', `${moment(dateTo).format('LL')}`);
    search.cats().should('have.value', cats);
    search.location().should('have.value', location);
  });

  it('unsuccessfully - does not fill in dates', () => {
    const cats = 2;
    const location = 'Stockholm';

    nav.search();
    search.location().click();
    search.locationOption(location).click();
    search.cats().type(cats, { force: true });
    search.submit();

    search.error().should('exist').and('include.text', errors.dates);
  });

  it('unsuccessfully - does not fill in cats', () => {
    const dateFrom = 'Oct 2, 2019';
    const dateTo = 'Oct 9, 2019';
    const location = 'Stockholm';

    cy.clock(new Date(2019, 9, 1).getTime(), ['Date']);
    nav.search();

    search.fromField().click();
    search.pickDate(dateFrom);
    search.pickDate(dateTo);
    search.location().click();
    search.locationOption(location).click();
    search.submit();
    search.error().should('exist').and('include.text', errors.cats);
  });

  it('unsuccessfully - does not fill in location', () => {
    const dateFrom = 'Oct 2, 2019';
    const dateTo = 'Oct 9, 2019';
    const cats = 2;

    cy.clock(new Date(2019, 9, 1).getTime(), ['Date']);
    nav.search();

    search.fromField().click();
    search.pickDate(dateFrom);
    search.pickDate(dateTo);
    search.cats().type(cats, { force: true });
    search.submit();
    search.error().should('exist').and('include.text', errors.location);
  });

  it('successfully - resolves the various errors', () => {
    const dateFrom = 'Oct 2, 2019';
    const dateTo = 'Oct 9, 2019';
    const cats = 2;
    const location = 'Stockholm';

    mockAPI.search({
      from: dateFrom,
      to: dateTo,
      cats: cats,
      location: location,
      resultsPerLocation: 'search/results_in_stockholm.json',
    });

    cy.clock(new Date(2019, 9, 1).getTime(), ['Date']);
    nav.search();

    search.submit();
    search
      .error()
      .should('exist')
      .and('include.text', errors.dates)
      .and('include.text', errors.cats)
      .and('include.text', errors.location);

    search.fromField().click();
    search.pickDate(dateFrom);
    search.pickDate(dateTo);
    search.submit();
    search
      .error()
      .should('exist')
      .and('not.include.text', errors.dates)
      .and('include.text', errors.cats)
      .and('include.text', errors.location);

    search.location().click();
    search.locationOption(location).click();
    search.submit();
    search
      .error()
      .should('exist')
      .and('not.include.text', errors.dates)
      .and('include.text', errors.cats)
      .and('not.include.text', errors.location);

    search.cats().type(cats, { force: true });
    search.submit();
    cy.location('pathname').should('eq', '/search-results');
  });
});
