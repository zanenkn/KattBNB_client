const api = 'http://localhost:3007/api/v1'
const url = {
  stripe: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=retrieve`,
  host_profile: `${api}/host_profiles/1?locale=en-US`
}

describe('User can see host profile progress bar from her User Page', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'GET',
      url: `${api}/reviews?host_profile_id=1&locale=en-US`,
      status: 200,
      response: 'fixture:one_user_reviews.json'
    })
    cy.route({
      method: 'GET',
      url: `${api}/bookings?dates=only&stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: []
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles?user_id=1&locale=en-US`,
      status: 200,
      response: 'fixture:host_profile_index.json'
    })
  })

  it('and see step-1 if no payment information are completed', () => {
    cy.route({
      method: 'GET',
      url: `${url.host_profile}`,
      status: 200,
      response: 'fixture:host_profile_individual.json'
    })
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: { "message": "No account" }
    })
    cy.get('#user-icon').click({ force: true })
    cy.contains('You made a host profile but have not provided us with your payment information.')
    cy.get('#progress-bar-cta').contains('Enter payment information')
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(1).should('not.have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(2).should('not.have.class', 'step-done-color')
  })

  beforeEach(() => {
    cy.fixture('host_profile_individual.json').then((host_profile) => {
      host_profile.stripe_account_id = 'acct-852147963'
      cy.route({
        method: 'GET',
        url: `${url.host_profile}`,
        status: 200,
        response: host_profile
      })
    })
  })

  it('and see step-2 when payment information have been provided and verification is pending', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_pending_verification.json'
    })
    cy.get('#user-icon').click({ force: true })
    cy.contains('Your verification is pending, please check back later.')
    cy.get('#progress-bar-cta').contains('My payment dashboard')
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(1).should('have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(2).should('not.have.class', 'step-done-color')
  })

  it('and see step-2 when payment information have been provided, verification is complete and erros exist', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_verification_errors.json'
    })
    cy.get('#user-icon').click({ force: true })
    cy.contains('Please visit your payment dashboard to complete your verification.')
    cy.get('#progress-bar-cta').contains('My payment dashboard')
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(1).should('have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(2).should('not.have.class', 'step-done-color')
  })

  it('and see step-3 when payment verification is complete without errors', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_verification_no_errors.json'
    })
    cy.get('#user-icon').click({ force: true })
    cy.get('#progress-bar-cta').contains('My payment dashboard')
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(1).should('have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(2).should('have.class', 'step-done-color')
  })

  it('and visit Stripe dashboard in a new window', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_verification_no_errors.json'
    })
    cy.route({
      method: 'GET',
      url: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=login_link`,
      status: 200,
      response: { "url": "https://stripe.com/" }
    })
    cy.route({
      method: 'GET',
      url: `${api}/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com`,
      status: 200,
      response: 'fixture:validate_token.json'
    })
    cy.visit('http://localhost:3000/user-page', {
      onBeforeLoad(win) {
        cy.stub(win, 'open')
      }
    })
    cy.get('#progress-bar-cta').click()
    cy.window().its('open').should('be.calledWith', 'https://stripe.com/')
  })

  it('and see an error when trying to visit Stripe dashboard', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 200,
      response: 'fixture:stripe_verification_no_errors.json'
    })
    cy.route({
      method: 'GET',
      url: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=login_link`,
      status: 555,
      response: { "error": "There was a problem connecting to our payments infrastructure provider. Please try again later." }
    })
    cy.route({
      method: 'GET',
      url: `${api}/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com`,
      status: 200,
      response: 'fixture:validate_token.json'
    })
    cy.visit('http://localhost:3000/user-page')
    cy.get('#progress-bar-cta').click()
    cy.contains('There was a problem connecting to our payments infrastructure provider. Please try again later.')
  })

  it('and see an error if connection with Stripe is unavailable', () => {
    cy.route({
      method: 'GET',
      url: `${url.stripe}`,
      status: 555,
      response: { "error": "There was a problem connecting to our payments infrastructure provider. Please try again later." }
    })
    cy.get('#user-icon').click({ force: true })
    cy.contains('There was a problem connecting to our payments infrastructure provider. Please try again later.')
    cy.get('#progress-bar-cta').contains('My payment dashboard')
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(1).should('not.have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(2).should('not.have.class', 'step-done-color')
  })
})
