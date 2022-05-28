import nav from '../../pages/navigation';
import login from '../../pages/login';
import userPage from '../../pages/userPage';
import mockAPI from '../../support/api';

describe('User tries to view profile page', () => {
  it('without logging in', () => {
    nav.userPage();
    userPage.wrapper().should('not.exist');
    login.loginForm().should('exist');
  });
});

describe('User views profile page when logged in', () => {
  it('has no host profile', () => {
    mockAPI.userPage();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.wrapper().should('exist');
    userPage.avatar.self().should('exist');
    userPage.username().should('exist').and('contain.text', 'GeorgeTheGreek');
    userPage.location().should('exist').and('contain.text', 'Stockholm');
    userPage.settingsSection.self().should('exist');
    userPage.createHostProfileCta().should('exist');
  });

  it('has host profile', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.wrapper().should('exist');
    userPage.avatar.self().should('exist');
    userPage.username().should('exist').and('contain.text', 'GeorgeTheGreek');
    userPage.location().should('exist').and('contain.text', 'Stockholm');
    userPage.settingsSection.self().should('exist');
    userPage.hostProfile.self().should('exist');
    userPage.hostProfileProgressBar.self().should('exist');
    userPage.reviewsSection.self().should('exist');
  });
});

describe('User can change the avatar', () => {
  it('successfully', () => {
    mockAPI.userPage({
      tokenValidation: 'validate_token.json',
      avatarChange: true,
    });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.avatar.edit().click();
    userPage.avatar.addPhoto().attachFile('good-picture.png');
    userPage.avatar.save().click();
    userPage.avatar.errorBox().should('not.exist');
  });

  it('unsuccessfully - wrong file format', () => {
    mockAPI.userPage();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    userPage.avatar.edit().click();
    userPage.avatar.addPhoto().attachFile('wrong-format-picture.svg');
    userPage.avatar.save().click();
    userPage.avatar.errorBox().should('exist').and('include.text', 'Please select a JPG, JPEG, PNG or GIF image file!');
  });
});
