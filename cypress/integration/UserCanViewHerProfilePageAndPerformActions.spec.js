describe('User can view her profile page', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:search_no_results.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?stats=no&host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: ''
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?stats=no&user_id=1&locale=en-US',
      status: 200,
      response: ''
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#user-icon').click({ force: true })
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
    cy.get('#editLocationForm').click()
    cy.get('#location').click()
    cy.get('.ui > #location > .visible > .item:nth-child(5) > .text').click()
    cy.get('#location-submit-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Location succesfully changed!')
    })
  })

  it('and does not change her location successfully', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth',
      status: 422,
      response: 'fixture:unsuccessful_location_change_user_page.json',
    })
    cy.get('#editLocationForm').click()
    cy.get('#location').click()
    cy.get('.ui > #location > .visible > .item:nth-child(5) > .text').click()
    cy.get('#location > .dropdown').click()
    cy.get('#location-submit-button').click()
    cy.contains('No location selected or location is unchanged!')
  })

  it('and change her password successfully', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth/password',
      status: 200,
      response: 'fixture:successful_password_change_user_page.json',
    })
    cy.get('#editPasswordForm').click()
    cy.get('#currentPassword').type('password')
    cy.get('#newPassword').type('SeCuReP@SsWoRd')
    cy.get('#newPasswordConfirmation').type('SeCuReP@SsWoRd', { force: true })
    cy.get('#password-submit-button').click()
    cy.contains('Log in')
  })

  it('and unsuccessfully tries to change password', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth/password',
      status: 422,
      response: 'fixture:unsuccessful_password_change_user_page.json',
    })
    cy.get('#editPasswordForm').click()
    cy.get('#currentPassword').type('passwordD')
    cy.get('#newPassword').type('SeCuReP@SsWoR')
    cy.get('#newPasswordConfirmation').type('SeCuReP@SsWoRd', { force: true })
    cy.get('#password-submit-button').click()
    cy.contains("Check that 'new password' fields are an exact match with each other and that they consist of at least 6 characters")
  })

  it('and change her notification settings successfully', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth',
      status: 200,
      response: 'fixture:successful_location_change.json',
    })
    cy.get('#editNotificationsForm').click()
    cy.get('.fitted > label').click()
    cy.get('#notifications-submit-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Message notification settings updated!')
    })
  })

  it('and unsuccessfully tries to change her notification settings', () => {
    cy.get('#editNotificationsForm').click()
    cy.get('#notifications-submit-button').click()
    cy.contains('No changes made to your settings!')
  })

  it('and change her email language preference settings successfully', () => {
    cy.route({
      method: 'PUT',
      url: 'http://localhost:3007/api/v1/auth',
      status: 200,
      response: 'fixture:successful_location_change.json',
    })
    cy.get('#editLangPrefForm').click()
    cy.get(':nth-child(2) > .ui > label').click()
    cy.get('#email-language-submit-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Email language settings updated!')
    })
  })

  it('and unsuccessfully tries to change her email language preference settings', () => {
    cy.get('#editLangPrefForm').click()
    cy.get('#email-language-submit-button').click()
    cy.contains('No changes made to your settings!')
  })

  it('and successfully deletes her account when no bookings are present', () => {
    cy.route({
      method: 'DELETE',
      url: 'http://localhost:3007/api/v1/auth',
      status: 200,
      response: 'fixture:successful_account_deletion.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?stats=yes&user_id=1&host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: { "message": "in_requests: 0, in_upcoming: 0, in_history: 0, out_requests: 0, out_upcoming: 0, out_history: 0" }
    })
    cy.get('#delete-account-link').click()
    cy.on('window:confirm', (str) => {
      expect(str).to.equal('Do you really want to delete your account?')
    })
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Your account was succesfully deleted!')
    })
    cy.contains('Find a cat sitter!')
  })

  it('and gets alert to check FAQ cause of incoming bookings when deleting her account', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?stats=no&host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: 'fixture:no_delete_account.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?stats=yes&user_id=1&host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: { "message": "in_requests: 2, in_upcoming: 1, in_history: 0, out_requests: 0, out_upcoming: 0, out_history: 0" }
    })
    cy.get('#delete-account-link').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('To delete your account, please follow relevant instructions in our FAQ page!')
    })
    cy.location('pathname').should('eq', '/user-page')
  })

  it('and gets alert to give her consent cause of outgoing bookings when deleting her account', () => {
    cy.route({
      method: 'DELETE',
      url: 'http://localhost:3007/api/v1/auth',
      status: 200,
      response: 'fixture:successful_account_deletion.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?stats=yes&user_id=1&host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: { "message": "in_requests: 0, in_upcoming: 0, in_history: 0, out_requests: 0, out_upcoming: 1, out_history: 0" }
    })
    cy.get('#delete-account-link').click()
    cy.on('window:confirm', (str) => {
      expect(str).to.equal("You still have upcoming outgoing booking(s). By deleting your account, you consent to sending your email to the host(s). If you don't want to disclose your email, wait for the booking(s) to be resolved and try deleting your account again.")
    })
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Your account was succesfully deleted!')
    })
    cy.contains('Find a cat sitter!')
  })
})
