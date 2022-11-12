class Search {
  self = () => cy.get('[data-cy=search]');
  fromField = () => this.self().find('[data-cy=from]');
  pickDate = (date) => this.self().find(`[aria-label$="${date}"]`).last().click({ force: true });
  location = () => this.self().find('[data-cy=location-dropdown]');
  locationOption = (opt) => this.self().find(`[data-cy=location-option-${opt}]`);
  cats = () => this.self().find('[data-cy=cats]');
  submit = () => this.self().find('[data-cy=submit]').click({ force: true });
  datePicker = {
    from: () => this.self().find('[data-cy=from]').find('input'),
    to: () => this.self().find('[data-cy=to]').find('input'),
  };
}

module.exports = new Search();
