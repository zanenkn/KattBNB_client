import nav from '../../pages/navigation';
import search from '../../pages/search';
import searchResults, { list, map } from '../../pages/searchResults';
import mockAPI from '../../support/api';
import moment from 'moment';

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
      resultsPerLocation: 'search/few_results.json',
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
    searchResults.resultCount().should('exist').and('have.text', '10 result(s)');
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
});
