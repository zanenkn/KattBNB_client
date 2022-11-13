import nav from '../../pages/navigation';
import search from '../../pages/search';
import searchResults, { map } from '../../pages/searchResults';
import mockAPI from '../../support/api';
import moment from 'moment';

describe('Search results as a map', () => {
  beforeEach(() => {
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
  });

  it('displayed correctly according to availability', () => {
    map.priceLabels().should('exist').and('have.length', 5);
    map.getPriceLabel(11).should('have.attr', 'data-cy-available', 'true');
    map.getPriceLabel(22).should('have.attr', 'data-cy-available', 'true');
    map.getPriceLabel(33).should('have.attr', 'data-cy-available', 'true');
    map.getPriceLabel(44).should('have.attr', 'data-cy-available', 'false');
    map.getPriceLabel(55).should('have.attr', 'data-cy-available', 'false');
  });

  it('resolves prices correctly', () => {
    map.priceLabels().should('exist').and('have.length', 5);
    map.getPriceLabel(11).should('have.text', '1116 kr');
    map.getPriceLabel(22).should('have.text', '1261 kr');
    map.getPriceLabel(33).should('have.text', '1261 kr');
    map.getPriceLabel(44).should('have.text', '2522 kr');
    map.getPriceLabel(55).should('have.text', '1746 kr');
  });
});

describe('Shareable search url', () => {
  const dateFrom = 'Oct 2, 2019';
  const dateTo = 'Oct 9, 2019';
  const cats = 2;
  const location = 'Stockholm';

  beforeEach(() => {
    mockAPI.search({
      from: dateFrom,
      to: dateTo,
      cats: cats,
      location: location,
      resultsPerLocation: 'search/results_in_stockholm.json',
    });
  });

  it('displays results correctly as a map', () => {
    nav.toUrl('/search-results?from=1569974400000&to=1570579200000&cats=2&location=Stockholm&view=map');

    searchResults
      .dates()
      .should('exist')
      .and('have.text', `${moment(dateFrom).format('LL')} - ${moment(dateTo).format('LL')}`);
    searchResults.cats().should('exist').and('have.text', cats);
    searchResults.location().should('exist').and('have.text', location);
    searchResults.resultCount().should('exist').and('have.text', '5 result(s)');

    map.wrapper().should('exist');
    map.priceLabels().should('exist').and('have.length', 5);
    map.getPriceLabel(11).should('have.attr', 'data-cy-available', 'true').and('have.text', '1116 kr');
    map.getPriceLabel(22).should('have.attr', 'data-cy-available', 'true').and('have.text', '1261 kr');
    map.getPriceLabel(33).should('have.attr', 'data-cy-available', 'true').and('have.text', '1261 kr');
    map.getPriceLabel(44).should('have.attr', 'data-cy-available', 'false').and('have.text', '2522 kr');
    map.getPriceLabel(55).should('have.attr', 'data-cy-available', 'false').and('have.text', '1746 kr');
  });

  it('view defaults to map when no view parameter in url', () => {
    nav.toUrl('/search-results?from=1569974400000&to=1570579200000&cats=2&location=Stockholm');
    map.wrapper().should('exist');
    cy.location().should(({ search }) => {
      expect(search).to.include('view=map');
    });
  });
});
