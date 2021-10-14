class Signup {
  fields = {
    email: () => cy.get('[data-cy=email]'),
    password: () => cy.get('[data-cy=password]'),
    passwordConfirmation: () => cy.get('[data-cy=password-confirmation]'),
    nickname: () => cy.get('[data-cy=nickname]'),
    location: () => cy.get('[data-cy=location-dropdown]'),
    locationOption: (opt) => cy.get(`[data-cy=location-option-${opt}]`),
    captcha: () => cy.get('[data-cy=captcha]'),
    tncToggle: () => cy.get('[data-cy=tnc-toggle]')
  }
  errors = () => cy.get('[data-cy=signup-errors]');
  submit = () => cy.get('[data-cy=signup-button]');
  fillCaptcha = () => cy.get('#cypress-captcha').invoke('text').then((cap)=> {
    this.fields.captcha().type(cap)
  })
}

module.exports = new Signup();