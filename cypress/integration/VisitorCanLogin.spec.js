describe('User can log in', () => {
  beforeEach(function () {
    cy.server()
  })

  it('succesfully', () => {
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.contains('Find a cat sitter!')
  })

  it('unsuccessfuly with invalid credentials', () => {
    cy.login('fixture:unsuccessful_login.json', 'george@mail.com', 'wrongpassword', 401)
    cy.contains('Invalid login credentials. Please try again.')
  })

  it('unsuccessfuly without first being confirmed through email', () => {
    cy.login('fixture:unsuccessful_login_no_confirmation.json', 'alonso@renault.com', 'wrongpassword', 401)
    cy.contains("A confirmation email was sent to your account at 'alonso@renault.com'. You must follow the instructions in the email before your account can be activated")
  })
})
