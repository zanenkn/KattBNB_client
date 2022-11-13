class SearchResults {
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
  };
}

module.exports = new SearchResults();
