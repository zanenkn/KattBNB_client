import nav from '../../pages/navigation';
import search from '../../pages/search';
import searchResults, { list, map, hostPopup } from '../../pages/searchResults';
import mockAPI from '../../support/api';
import moment from 'moment';

const dateFrom = 'Oct 2, 2019';
const dateTo = 'Oct 9, 2019';
const cats = 2;
const location = 'Stockholm';
const costDescription =
  'The stay for 2 cats with during the dates of October 2nd until October 9th would in total cost';
const requestCta = 'Request to book';
const bookCta = 'Book';

describe('Host popup', () => {
  beforeEach(() => {
    mockAPI.search({
      from: dateFrom,
      to: dateTo,
      cats: cats,
      location: location,
      resultsPerLocation: 'search/results_in_stockholm.json',
      withProfiles: [11, 22, 33, 44, 55],
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

  it('can be entered from map view', () => {
    map.getPriceLabel(11).click();
    hostPopup.wrapper('should.exist');
  });

  it('can be entered from list view', () => {
    map.awaitLoaded();
    searchResults.listView().click();
    list.getItem(11).click();
    hostPopup.wrapper('should.exist');
  });

  it('displays availability correctly', () => {
    const assertAvailable = (available) => {
      if (available) {
        hostPopup.badge().should('exist').and('have.attr', 'data-cy-badge', 'availability');
        hostPopup.available().should('exist');
        hostPopup.messageHostCta().should('not.exist');
        hostPopup.requestCta().should('include.text', bookCta);
        hostPopup.availabilityDisclaimer().should('not.exist');
      } else {
        hostPopup.wrapper('should.exist');
        hostPopup.available().should('not.exist');
        hostPopup.messageHostCta().should('exist');
        hostPopup.requestCta().should('have.text', requestCta);
        hostPopup.availabilityDisclaimer().should('exist');
      }
    };

    map.getPriceLabel(11).click();
    hostPopup.wrapper('should.exist');
    assertAvailable(true);

    cy.clickOutside();
    map.getPriceLabel(22).click();
    hostPopup.wrapper('should.exist');
    assertAvailable(true);

    cy.clickOutside();
    map.getPriceLabel(33).click();
    hostPopup.wrapper('should.exist');
    assertAvailable(true);

    cy.clickOutside();
    map.getPriceLabel(44).click();
    assertAvailable(false);
    hostPopup.badge().should('not.exist');

    cy.clickOutside();
    map.getPriceLabel(55).click();
    hostPopup.wrapper('should.exist');
    assertAvailable(false);
    hostPopup.badge().should('not.have.attr', 'data-cy-badge', 'availability');
  });

  it('displays reviews and score correctly', () => {
    map.getPriceLabel(11).click();
    hostPopup.wrapper('should.exist');
    hostPopup.reviews().should('exist').and('have.text', '2 reviews');
    hostPopup.badge().should('not.have.attr', 'data-cy-badge', 'reviews');
    hostPopup.score().should('exist').and('have.attr', 'data-cy-score', 4);

    cy.clickOutside();
    map.getPriceLabel(22).click();
    hostPopup.wrapper('should.exist');
    hostPopup.reviews().should('exist').and('have.text', '3 reviews');
    hostPopup.badge().should('not.have.attr', 'data-cy-badge', 'reviews');
    hostPopup.score().should('exist').and('have.attr', 'data-cy-score', 5);

    cy.clickOutside();
    map.getPriceLabel(33).click();
    hostPopup.wrapper('should.exist');
    hostPopup.reviews().should('not.exist');
    hostPopup.badge().should('not.have.attr', 'data-cy-badge', 'reviews');
    hostPopup.score().should('not.exist');

    cy.clickOutside();
    map.getPriceLabel(44).click();
    hostPopup.wrapper('should.exist');
    hostPopup.reviews().should('not.exist');
    hostPopup.badge().should('not.exist');
    hostPopup.score().should('not.exist');

    cy.clickOutside();
    map.getPriceLabel(55).click();
    hostPopup.wrapper('should.exist');
    hostPopup.reviews().should('exist').and('have.text', '2 reviews');
    hostPopup.badge().should('have.attr', 'data-cy-badge', 'reviews');
    hostPopup.score().should('exist').and('have.attr', 'data-cy-score', 4.5);
  });
});
