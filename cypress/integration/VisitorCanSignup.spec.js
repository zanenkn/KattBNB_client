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

    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
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

    cy.get('#sign-up-button').click()
    cy.visit('http://localhost:3000/signup-success')
    cy.contains('Successful signup!')
  })

  it('and gets error message if captcha is invalid', () => {
    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
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

    cy.get('#sign-up-button').click()

    cy.contains("You didn't input the captcha phrase correctly, please try again!")
  })


  // Comment out previous test block for the below block to pass

  // it('and gets error message if email is not valid and/or passwords do not match', () => {
  //   cy.route({
  //     method: 'POST',
  //     url: 'http://localhost:3007/api/v1/auth',
  //     status: 422,
  //     response: 'fixture:unsuccessful_signup.json',
  //   })

  //   cy.get('#hamburger').within(() => {
  //     cy.get('.icon').click()
  //   })
  //   cy.get('#signup').click()
  //   cy.get('#signup-form').within(() => {

  //     let text = [
  //       ['#email', 'zane@mail'],
  //       ['#password', 'pass'],
  //       ['#passwordConfirmation', 'passw'],
  //       ['#nickname', 'KittenPrincess']
  //     ]

  //     text.forEach(element => {
  //       cy.get(element[0]).type(element[1])
  //     })
  //   })

  //   cy.get('#sign-up-button').click()

  //   let text = [
  //     "Password confirmation doesn't match Password",
  //     'Password is too short (minimum is 6 characters)',
  //     'Email is not an email',
  //     "Location can't be blank",
  //   ]

  //   text.forEach(error => {
  //     cy.contains(error)
  //   })
  // })
})
