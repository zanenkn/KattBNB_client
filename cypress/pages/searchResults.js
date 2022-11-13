class SearchResults {
  general = {
    username: () => cy.get('[data-cy=username]'),
    avatar: () => cy.get('[data-cy=avatar]'),
    price: () => cy.get('[data-cy=price]'),
    score: () => cy.get('[data-cy-score]'),
    badge: () => cy.get('[data-cy-badge]'),
    available: () => cy.get('[data-cy=available]'),
    reviews: () => cy.get('[data-cy=reviews]'),
  };
  criteriaWrapper = () => cy.get('[data-cy=search-criteria]');
  dates = () => this.criteriaWrapper().find('[data-cy=dates]');
  location = () => this.criteriaWrapper().find('[data-cy=location]');
  cats = () => this.criteriaWrapper().find('[data-cy=cats]');
  mapView = () => this.criteriaWrapper().find('[data-cy=map]');
  listView = () => this.criteriaWrapper().find('[data-cy=list]');
  back = () => this.criteriaWrapper().find('[data-cy=back]');
  resultCount = () => this.criteriaWrapper().find('[data-cy=result-count]');

  map = {
    zoomOut: () => cy.get('[aria-label="Zoom out"]'),
    awaitLoaded: () => this.map.zoomOut().should('exist'),
    wrapper: () => {
      this.map.awaitLoaded();
      return cy.get('[data-cy=map]');
    },
    priceLabels: () => this.map.wrapper().find('[data-cy^=price-label]'),
    getPriceLabel: (id) => this.map.wrapper().find(`[data-cy=price-label-${id}]`),
  };

  list = {
    wrapper: () => cy.get('[data-cy=list]'),
    backToMap: () => this.list.wrapper().find('[data-cy=map]'),
    items: () => this.list.wrapper().find('[data-cy-list-card]'),
    getItem: (id) => this.list.wrapper().find(`[data-cy-list-card=${id}]`),
    innerWrapper: () => this.list.wrapper().find('[data-cy=inner-wrapper]'),
    result: (id) => {
      return {
        getPrice: () => this.list.getItem(id).find('[data-cy=price]'),
        getBadge: () => this.list.getItem(id).find('[data-cy-badge]'),
      };
    },
    ...this.general,
  };

  hostPopup = {
    wrapper: () => cy.get('[data-cy=host-popup]'),
    location: () => this.hostPopup.wrapper().find('[data-cy=location]'),
    messageHostCta: () => this.hostPopup.wrapper().find('[data-cy=message-host]'),
    requestCta: () => this.hostPopup.wrapper().find('[data-cy=request-to-book]'),
    toHostProfile: () => this.hostPopup.wrapper().find('[data-cy=host-profile]'),
    availabilityDisclaimer: () => this.hostPopup.wrapper().find('[data-cy=availability-disclaimer]'),
    ...this.general,
  };
}

module.exports = new SearchResults();
