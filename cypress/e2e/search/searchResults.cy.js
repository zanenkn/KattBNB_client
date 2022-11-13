import nav from '../../pages/navigation';
import search from '../../pages/search';
import searchResults, { list, map } from '../../pages/searchResults';
import mockAPI from '../../support/api';

describe('Search results', () => {
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
      results: 'search/results_outside_stockholm.json',
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

  it('displayed correctly when no results', () => {
    searchResults.resultCount().should('exist').and('have.text', '0 result(s)');
    map.awaitLoaded();
    searchResults.listView().click();
    list
      .wrapper()
      .should(
        'have.text',
        'Your search did not yield any results! Try changing your search criteria or go to the map view to find cat sitters in nearby areas.'
      );
    list.backToMap().click();
    map.priceLabels().should('not.exist');
    map.zoomOut().click().click().click();
    map.priceLabels().should('exist').and('have.length', 2);
  });

  it.only('can change between map and list view', () => {
    map.wrapper().should('exist');
    cy.location().should(({ search }) => {
      expect(search).to.include('view=map');
    });
    searchResults.listView().click();
    list.wrapper().should('exist');
    cy.location().should(({ search }) => {
      expect(search).to.include('view=list');
    });
  });
});
