describe('User can view her profile page', () => {
  beforeEach(function () {
    cy.server()
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#user-icon').click()
    })
  })

  it('successfully', () => {
    cy.contains('Hi, GeorgeTheGreek!')
  })

  it('and change her location successfully', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth',
      status: 200,
      response: 'fixture:successful_location_change.json',
    })
    cy.get('#change-location-link').click()
    cy.get('#location').click()
    cy.get('.ui > #location > .visible > .item:nth-child(5) > .text').click()
    cy.get('#password').type('password')
    cy.get('#location-submit-button').click()
    cy.wait(3000)
    cy.get('#user-location').within(() => {
      cy.contains('Arboga')
    })
  })

  it('and does not change her location successfully cause of wrong password', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth',
      status: 422,
      response: 'fixture:unsuccessful_location_change_user_page.json',
    })
    cy.get('#change-location-link').click()
    cy.get('#location').click()
    cy.get('.ui > #location > .visible > .item:nth-child(5) > .text').click()
    cy.get('#password').type('pass')
    cy.get('#location-submit-button').click()
    cy.contains('Current password is invalid')
  })

  it('and change her password successfully', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth/password',
      status: 200,
      response: 'fixture:successful_password_change2.json',
    })
    cy.get('#change-password-link').click()
    cy.get('#current-password').type('password')
    cy.get('#password').type('SeCuReP@SsWoRd')
    cy.get('#password-confirmation').type('SeCuReP@SsWoRd')
    cy.get('#change-pass-button').click()
    cy.contains('You have succesfully changed your password! Wait to be redirected.')
  })

  it('and unsuccessfully tries to change password', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth/password',
      status: 422,
      response: 'fixture:unsuccessful_password_change2.json',
    })
    cy.get('#change-link-password').click()
    cy.get('#current-password').type('passwordD')
    cy.get('#password').type('SeCuReP@SsWoR')
    cy.get('#password-confirmation').type('SeCuReP@SsWoRd')
    cy.get('#change-pass-button').click()
    cy.contains('GET YOUR SHIT TOGETHER MAN!')
  })
})