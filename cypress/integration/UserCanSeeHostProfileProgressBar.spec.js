describe('User can see host profile progress bar from her User Page', () => {
  beforeEach(function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/reviews?host_profile_id=1&locale=en-US',
      status: 200,
      response: 'fixture:one_user_reviews.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/bookings?dates=only&stats=no&host_nickname=GeorgeTheGreek&locale=en-US',
      status: 200,
      response: []
    })
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
  })

  it('and see step-1 if no payment information are completed', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_index.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles/1?locale=en-US',
      status: 200,
      response: 'fixture:host_profile_individual.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/stripe?locale=en-US&host_profile_id=1',
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

  it('and see step-2 when payment information have been provided and verification is pending', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_index.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles/1?locale=en-US',
      status: 200,
      response: 'fixture:host_profile_individual_stripe.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/stripe?locale=en-US&host_profile_id=1',
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
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_index.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles/1?locale=en-US',
      status: 200,
      response: 'fixture:host_profile_individual_stripe.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/stripe?locale=en-US&host_profile_id=1',
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
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_index.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles/1?locale=en-US',
      status: 200,
      response: 'fixture:host_profile_individual_stripe.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/stripe?locale=en-US&host_profile_id=1',
      status: 200,
      response: 'fixture:stripe_verification_no_errors.json'
    })
    cy.get('#user-icon').click({ force: true })
    cy.get('#progress-bar-cta').contains('My payment dashboard')
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(1).should('have.class', 'step-done-color')
    cy.get('.progress-bar-steps>div').eq(2).should('have.class', 'step-done-color')
  })

  it('and see an error if connection with Stripe is unavailable', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles?user_id=1&locale=en-US',
      status: 200,
      response: 'fixture:host_profile_index.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/host_profiles/1?locale=en-US',
      status: 200,
      response: 'fixture:host_profile_individual_stripe.json'
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/api/v1/stripe?locale=en-US&host_profile_id=1',
      status: 500,
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
