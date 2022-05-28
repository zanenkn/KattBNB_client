class createHostProfile {
  wrapper = () => cy.get('[data-cy=create-host-profile-form]')
  description = () => cy.get('[data-cy=description]')
  rate = () => cy.get('[data-cy=rate]')
  supplement = () => cy.get('[data-cy=supplement]')
  maxCats = () => cy.get('[data-cy=max-cats]')
  address = () => cy.get('[data-cy=address]')
  availability = () => cy.get('[data-cy=availability]')
  chooseDate = (date) => this.availability().find(`[aria-label$="${date}"]`).click()
  submit = () => cy.get('[data-cy=submit]').click()
  errors = () => cy.get('[data-cy=errors]')
}

module.exports = new createHostProfile();