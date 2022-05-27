import nav from '../../pages/navigation';
import userPage from '../../pages/userPage';
import mockAPI from '../../support/api';

describe('Host profile progress bar', () => {
  it('not visible if no host profile', () => {
    mockAPI.userPage();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.hostProfileProgressBar.self().should('not.exist');
  });

  it('Stripe onboarding not started', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/host_profile_individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.hostProfileProgressBar.self().should('exist');
    userPage.hostProfileProgressBar.getStep(1).should('have.attr', 'data-cy-active', 'true');
    userPage.hostProfileProgressBar.getStep(2).should('have.attr', 'data-cy-active', 'false');
    userPage.hostProfileProgressBar.getStep(3).should('have.attr', 'data-cy-active', 'false');
    userPage.hostProfileProgressBar.cta().should('have.text', 'Enter payment information');
  });

  it('Stripe onboarding pending', () => {
    mockAPI.userPage({
      hostProfile: 'hostProfile/host_profile_individual.json',
      hostProfileModifications: {
        stripe_account_id: 'acct-123456',
      },
      stripeAccount: 'stripe/pending_verification.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.hostProfileProgressBar.self().should('exist');
    userPage.hostProfileProgressBar.getStep(1).should('have.attr', 'data-cy-active', 'true');
    userPage.hostProfileProgressBar.getStep(2).should('have.attr', 'data-cy-active', 'true');
    userPage.hostProfileProgressBar.getStep(3).should('have.attr', 'data-cy-active', 'false');
    userPage.hostProfileProgressBar
      .self()
      .should('include.text', 'Your verification is pending, please check back later.');
    userPage.hostProfileProgressBar.cta().should('have.text', 'My payment dashboard').and('have.attr', 'color', 'info');
  });

  it('Stripe onboarding pending - action required', () => {
    mockAPI.userPage({
      hostProfile: 'hostProfile/host_profile_individual.json',
      hostProfileModifications: {
        stripe_account_id: 'acct-123456',
      },
      stripeAccount: 'stripe/verification_with_errors.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.hostProfileProgressBar.self().should('exist');
    userPage.hostProfileProgressBar.getStep(1).should('have.attr', 'data-cy-active', 'true');
    userPage.hostProfileProgressBar.getStep(2).should('have.attr', 'data-cy-active', 'true');
    userPage.hostProfileProgressBar.getStep(3).should('have.attr', 'data-cy-active', 'false');
    userPage.hostProfileProgressBar
      .self()
      .should('include.text', 'Please visit your payment dashboard to complete your verification.');
    userPage.hostProfileProgressBar
      .cta()
      .should('have.text', 'My payment dashboard')
      .and('have.attr', 'color', 'primary');
  });

  it('Stripe onboarding successful', () => {
    mockAPI.userPage({
      hostProfile: 'hostProfile/host_profile_individual.json',
      hostProfileModifications: {
        stripe_account_id: 'acct-1234567',
      },
      stripeAccount: 'stripe/verification_no_errors.json',
    });

    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.hostProfileProgressBar.self().should('exist');
    userPage.hostProfileProgressBar.getStep(1).should('have.attr', 'data-cy-active', 'true');
    userPage.hostProfileProgressBar.getStep(2).should('have.attr', 'data-cy-active', 'true');
    userPage.hostProfileProgressBar.getStep(3).should('have.attr', 'data-cy-active', 'true');
    userPage.hostProfileProgressBar.cta().should('have.text', 'My payment dashboard').and('have.attr', 'color', 'info');
  });
});
