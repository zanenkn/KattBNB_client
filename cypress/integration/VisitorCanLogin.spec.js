import { Item } from "semantic-ui-react";

describe('User can log in', () => {
  beforeEach(function () {
    cy.server()
  })
  
  it('succesfully', () => {
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.contains('You have successfully logged in')
  })

  it('with invalid credentials', () => {
    cy.login('fixture:unsuccessful_login.json', 'george@mail.com', 'wrongpassword', 401)
    cy.contains('Invalid login credentials. Please try again.')
  })
})