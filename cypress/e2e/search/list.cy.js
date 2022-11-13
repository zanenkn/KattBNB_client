import nav from '../../pages/navigation';
import search from '../../pages/search';
import searchResults, { list, map } from '../../pages/searchResults';
import mockAPI from '../../support/api';
import moment from 'moment';

const dateFrom = 'Oct 2, 2019';
const dateTo = 'Oct 9, 2019';
const cats = 2;
const location = 'Stockholm';

describe('Search results as a list', () => {
  beforeEach(() => {
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
    map.awaitLoaded();
    searchResults.listView().click();
  });

  it('sorted correctly according to availability and reviews', () => {
    list.wrapper().should('exist');
    list.items().should('exist').and('have.length', 5);
    list.innerWrapper().children().eq(0).should('have.attr', 'data-cy-list-card', 22);
    list.innerWrapper().children().eq(1).should('have.attr', 'data-cy-list-card', 11);
    list.innerWrapper().children().eq(2).should('have.attr', 'data-cy-list-card', 33);
    list.innerWrapper().children().eq(3).should('have.attr', 'data-cy-list-card', 55);
    list.innerWrapper().children().eq(4).should('have.attr', 'data-cy-list-card', 44);
  });

  it('resolves prices correctly', () => {
    list.result(11).getPrice().should('have.text', '1116 kr');
    list.result(22).getPrice().should('have.text', '1261 kr');
    list.result(33).getPrice().should('have.text', '1261 kr');
    list.result(44).getPrice().should('have.text', '1746 kr');
    list.result(55).getPrice().should('have.text', '2522 kr');
  });

  it('displays badges correctly', () => {
    list.result(11).getBadge().should('exist').and('have.attr', 'data-cy-badge', 'availability');
    list.result(22).getBadge().should('exist').and('have.attr', 'data-cy-badge', 'availability');
    list.result(33).getBadge().should('exist').and('have.attr', 'data-cy-badge', 'availability');
    list.result(44).getBadge().should('not.exist');
    list.result(55).getBadge().should('exist').and('have.attr', 'data-cy-badge', 'reviews');
  });

  it('displays avatar, name and price for each cat sitter', () => {
    list.items().each((listItem) => {
      cy.wrap(listItem).within(() => {
        list.price().should('exist');
        list.avatar().should('exist');
        list.username().should('exist');
      });
    });
  });

  it('displays and reviews information correctly', () => {
    list.getItem(11).within(() => {
      list.score().should('exist').and('have.attr', 'data-cy-score', '4');
      list.reviews().should('exist').and('have.text', '2 reviews');
      list.available().should('exist');
    });

    list.getItem(22).within(() => {
      list.score().should('exist').and('have.attr', 'data-cy-score', '5');
      list.reviews().should('exist').and('have.text', '3 reviews');
      list.available().should('exist');
    });

    list.getItem(33).within(() => {
      list.score().should('not.exist');
      list.reviews().should('not.exist');
      list.available().should('exist');
    });

    list.getItem(44).within(() => {
      list.score().should('not.exist');
      list.reviews().should('not.exist');
      list.available().should('not.exist');
    });

    list.getItem(55).within(() => {
      list.score().should('exist').and('have.attr', 'data-cy-score', '4.5');
      list.reviews().should('exist').and('have.text', '2 reviews');
      list.available().should('not.exist');
    });
  });
});

describe('Shareable search url', () => {
  it('displays results correctly as a list', () => {
    mockAPI.search({
      from: dateFrom,
      to: dateTo,
      cats: cats,
      location: location,
      resultsPerLocation: 'search/results_in_stockholm.json',
    });

    nav.toUrl('/search-results?from=1569974400000&to=1570579200000&cats=2&location=Stockholm&view=list');

    searchResults
      .dates()
      .should('exist')
      .and('have.text', `${moment(dateFrom).format('LL')} - ${moment(dateTo).format('LL')}`);
    searchResults.cats().should('exist').and('have.text', cats);
    searchResults.location().should('exist').and('have.text', location);
    searchResults.resultCount().should('exist').and('have.text', '5 result(s)');

    list.wrapper().should('exist');
    list.items().should('exist').and('have.length', 5);
    list.innerWrapper().children().eq(0).should('have.attr', 'data-cy-list-card', 22);
    list.innerWrapper().children().eq(1).should('have.attr', 'data-cy-list-card', 11);
    list.innerWrapper().children().eq(2).should('have.attr', 'data-cy-list-card', 33);
    list.innerWrapper().children().eq(3).should('have.attr', 'data-cy-list-card', 55);
    list.innerWrapper().children().eq(4).should('have.attr', 'data-cy-list-card', 44);

    list.result(11).getPrice().should('have.text', '1116 kr');
    list.result(22).getPrice().should('have.text', '1261 kr');
    list.result(33).getPrice().should('have.text', '1261 kr');
    list.result(44).getPrice().should('have.text', '1746 kr');
    list.result(55).getPrice().should('have.text', '2522 kr');
  });
});
