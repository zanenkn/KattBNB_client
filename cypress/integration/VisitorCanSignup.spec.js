describe('Visitor can sign up', () => {

  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000')
  })

  it('successfully', () => {
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/auth',
      status: 200,
      response: 'fixture:successful_signup.json'
    })

    cy.get('.hamburger-box').click()
    cy.get('#signup').click()
    cy.get('#signup-form').within(() => {

      let text = [
        ['#email', 'zane@mail.com'],
        ['#password', 'password'],
        ['#passwordConfirmation', 'password'],
        ['#nickname', 'KittenPrincess']
      ]

      text.forEach(element => {
        cy.get(element[0]).type(element[1])
      })
    })

    cy.get('#location').click()
    cy.get('.visible > .selected > .text').click()

    cy.get('.fitted > label').click()
    cy.get('#sign-up-button').click()
    cy.visit('http://localhost:3000/signup-success')
    cy.contains('Successful signup!')
  })

  it('and gets error message if captcha is invalid', () => {
    cy.get('.hamburger-box').click()
    cy.get('#signup').click()
    cy.get('#signup-form').within(() => {

      let text = [
        ['#email', 'zane@mail'],
        ['#password', 'pass'],
        ['#passwordConfirmation', 'pass'],
        ['#nickname', 'KittenPrincess']
      ]

      text.forEach(element => {
        cy.get(element[0]).type(element[1])
      })
    })

    cy.get('.fitted > label').click()
    cy.get('#sign-up-button').click()

    cy.contains("You didn't input the captcha phrase correctly, please try again!")
  })

  it('and gets a disabled sign up button if she does not accept Terms & Conditions', () => {
    cy.get('.hamburger-box').click()
    cy.get('#signup').click()
    cy.get('#signup-form').within(() => {

      let text = [
        ['#email', 'zane@mail'],
        ['#password', 'pass'],
        ['#passwordConfirmation', 'pass'],
        ['#nickname', 'KittenPrincess']
      ]

      text.forEach(element => {
        cy.get(element[0]).type(element[1])
      })
    })

    cy.get('#sign-up-button').should('have.class', 'disabled')
  })
})
