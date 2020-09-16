const email = 'george@mail.com'
const errors = {
 credentials: 'Invalid login credentials. Please try again.',
 confirmation: `A confirmation email was sent to your account at ${email}. 
                You must follow the instructions in the email before your account can be activated`
}

describe('User can log in and logout', () => {
  beforeEach(() => {
    cy.server()
  })
  context('login', () => {
    it('succesfully', () => {
      cy.login('fixture:successful_login.json', email, 'password', 200)
      cy.contains('Welcome to KattBNB!')
    })
  
    it('unsuccessfuly with invalid credentials', () => {
      cy.login({
        'success': false,
        'errors': [errors.credentials]
      }, email, 'wrongpassword', 401)
      cy.contains('Invalid login credentials. Please try again.')
    })
  
    it('unsuccessfuly without first being confirmed through email', () => {
      cy.login({
        'success': false,
        'errors': [errors.confirmation]
      }, email, 'wrongpassword', 401)
      cy.contains(`A confirmation email was sent to your account at ${email}.`)
    })  
  })

  context('logout', () => {
    it('successfully', () => {
      cy.route({
        method: 'DELETE',
        url: 'http://localhost:3007/api/v1/auth/sign_out',
        status: 200,
        response: 'fixture:successful_signout.json'
      })
      cy.login('fixture:successful_login.json', email, 'password', 200)
      cy.wait(1000)
      cy.get('.hamburger-box').click()
      cy.get('#logout').click()
      cy.contains('Welcome to KattBNB!')
    })
  })
})
