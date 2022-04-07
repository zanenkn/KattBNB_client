const api = 'http://localhost:3007/api/v1';
const url = {
  stripe: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=retrieve`,
  stripe_login: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=login_link`,
  host_profile: `${api}/host_profiles/1?locale=en-US`,
};

function validateToken() {
  cy.route({
    method: 'GET',
    url: `${api}/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com`,
    status: 200,
    response: 'fixture:validate_token.json',
  });
}

function stripeCall(status, response, url) {
  cy.route({
    method: 'GET',
    url: url,
    status: status,
    response: response,
  });
}

describe('User can see host profile progress bar from User Page', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${api}/reviews?host_profile_id=1&locale=en-US`,
      status: 200,
      response: 'fixture:one_user_reviews.json',
    });
    cy.route({
      method: 'GET',
      url: `${api}/bookings?dates=only&stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: [],
    });
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles?user_id=66&locale=en-US`,
      status: 200,
      response: 'fixture:host_profile_index.json',
    });
  });

  it('and see step-1 if no payment information are completed', () => {
    cy.route({
      method: 'GET',
      url: `${url.host_profile}`,
      status: 200,
      response: 'fixture:host_profile_individual.json',
    });
    stripeCall(200, { message: 'No account' }, `${url.stripe}`);
    cy.get('#user-icon').click({ force: true });
    cy.contains('You made a host profile but have not provided us with your payment information.').should('exist');
    cy.get('#progress-bar-cta').should('have.text', 'Enter payment information');
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color');
    cy.get('.progress-bar-steps>div').eq(1).should('not.have.class', 'step-done-color');
    cy.get('.progress-bar-steps>div').eq(2).should('not.have.class', 'step-done-color');
  });

  beforeEach(() => {
    cy.fixture('host_profile_individual.json').then((host_profile) => {
      host_profile.stripe_account_id = 'acct-852147963';
      cy.route({
        method: 'GET',
        url: `${url.host_profile}`,
        status: 200,
        response: host_profile,
      });
    });
  });

  it('and see step-2 when payment information have been provided and verification is pending', () => {
    stripeCall(200, 'fixture:stripe_pending_verification.json', `${url.stripe}`);
    cy.get('#user-icon').click({ force: true });
    cy.contains('Your verification is pending, please check back later.').should('exist');
    cy.get('#progress-bar-cta').should('have.text', 'My payment dashboard');
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color');
    cy.get('.progress-bar-steps>div').eq(1).should('have.class', 'step-done-color');
    cy.get('.progress-bar-steps>div').eq(2).should('not.have.class', 'step-done-color');
  });

  it('and see step-2 when payment information have been provided, verification is complete and errors exist', () => {
    stripeCall(200, 'fixture:stripe_verification_errors.json', `${url.stripe}`);
    cy.get('#user-icon').click({ force: true });
    cy.contains('Please visit your payment dashboard to complete your verification.').should('exist');
    cy.get('#progress-bar-cta').should('have.text', 'My payment dashboard');
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color');
    cy.get('.progress-bar-steps>div').eq(1).should('have.class', 'step-done-color');
    cy.get('.progress-bar-steps>div').eq(2).should('not.have.class', 'step-done-color');
  });

  it('and see step-3 when payment verification is complete without errors', () => {
    stripeCall(200, 'fixture:stripe_verification_no_errors.json', `${url.stripe}`);
    cy.get('#user-icon').click({ force: true });
    cy.get('#progress-bar-cta').should('have.text', 'My payment dashboard');
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color');
    cy.get('.progress-bar-steps>div').eq(1).should('have.class', 'step-done-color');
    cy.get('.progress-bar-steps>div').eq(2).should('have.class', 'step-done-color');
  });

  it('and visit Stripe dashboard in a new window', () => {
    stripeCall(200, 'fixture:stripe_verification_no_errors.json', `${url.stripe}`);
    stripeCall(200, { url: 'https://stripe.com/' }, `${url.stripe_login}`);
    validateToken();
    cy.visit('http://localhost:3000/user-page', {
      onBeforeLoad(win) {
        cy.stub(win, 'open');
      },
    });
    cy.get('#progress-bar-cta').click();
    cy.window().its('open').should('be.calledWith', 'https://stripe.com/');
  });

  it('and see an error when trying to visit Stripe dashboard', () => {
    stripeCall(200, 'fixture:stripe_verification_no_errors.json', `${url.stripe}`);
    stripeCall(
      555,
      {
        error: 'There was a problem connecting to our payments infrastructure provider. Please try again later.',
      },
      `${url.stripe_login}`
    );
    validateToken();
    cy.visit('http://localhost:3000/user-page');
    cy.get('#progress-bar-cta').click();
    cy.contains(
      'There was a problem connecting to our payments infrastructure provider. Please try again later.'
    ).should('exist');
  });

  it('and see an error if connection with Stripe is unavailable', () => {
    stripeCall(
      555,
      {
        error: 'There was a problem connecting to our payments infrastructure provider. Please try again later.',
      },
      `${url.stripe}`
    );
    cy.get('#user-icon').click({ force: true });
    cy.contains(
      'There was a problem connecting to our payments infrastructure provider. Please try again later.'
    ).should('exist');
    cy.get('.progress-bar-steps>div').eq(0).should('have.class', 'step-done-color');
    cy.get('.progress-bar-steps>div').eq(1).should('not.have.class', 'step-done-color');
    cy.get('.progress-bar-steps>div').eq(2).should('not.have.class', 'step-done-color');
  });
});
