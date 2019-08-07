describe('User can sign up', () => {

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
    
    cy.get('#hamburger').click()
    cy.get('#sign-up-link').click()
    cy.get('#signup-form').within(() => {

      let text = [
        ['#email', 'zane@mail.com'],
        ['#password', 'password'],
        ['#password-confirmation', 'password'],
        ['#username', 'KittenPrincess']
        ['#location', 'Göteborg']
        ]
        
      text.forEach(element => {
        cy.get(element[0]).type(element[1])
      })
    })

    cy.get('#sign-up-button').click()
    cy.contains('You have succesfully created an account!')
  })

  it('and gets error message if email is not valid and/or passwords do not match', () => {
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/auth',
      status: 422,
      response: 'fixture:unsuccessful_signup.json',
    })
 
    cy.get('#hamburger').click()
    cy.get('#sign-up-link').click()
    cy.get('#signup-form').within(() => {

      let text = [
      ['#email', 'george@'],
      ['#password', 'pass'],
      ['#password-confirmation', 'password'],
      ['#username', 'raptorf1'],
      ['#location', '']
      ]

      text.forEach(element => {
        cy.get(element[0]).type(element[1])
      })
    })

    cy.get('#sign-up-button').click()

    let text = [
      "Password confirmation doesn't match Password",
      'Password is too short (minimum is 6 characters',
      'Email is not an email',
      "Location can't be blank",
      ]

      text.forEach(post => {
        cy.contains(post)
      })
    })
})