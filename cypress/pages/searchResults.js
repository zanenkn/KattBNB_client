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
    awaitLoaded: () => cy.get('[aria-label="Zoom in"]').should('exist'),
    wrapper: () => {
      this.map.awaitLoaded();
      return cy.get('[data-cy=map]');
    },
  };

  list = {
    wrapper: () => cy.get('[data-cy=list]'),
  };
}

module.exports = new SearchResults();
