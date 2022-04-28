class createHostProfile {
  wrapper = () => cy.get('[data-cy=create-host-profile-form]')
}

module.exports = new createHostProfile();