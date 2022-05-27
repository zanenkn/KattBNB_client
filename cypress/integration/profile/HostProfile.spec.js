import nav from '../../pages/navigation';
import login from '../../pages/login';
import userPage, { hostProfile } from '../../pages/userPage';
import mockAPI from '../../support/api';
import assert from '../../support/assertions';
import createHostProfile from '../../pages/createHostProfile';

describe('Viewing host profile', () => {
  it('no host profile', () => {
    mockAPI.userPage();
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.self().should('not.exist');
    userPage.createHostProfileCta().should('exist');
    userPage.wrapper().should('exist');
  });

  it('host profile exists', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.self().should('exist');
    hostProfile.description().should('exist').and('include.text', 'this is a description about me!!!!');
    hostProfile
      .address()
      .should('exist')
      .and('include.text', 'Charles de Gaulle Airport (CDG), 95700 Roissy-en-France, France');
    hostProfile.rate().should('exist').and('include.text', '100 kr/day for 1 cat');
    hostProfile.supplement().should('exist').and('include.text', 'Extra 35 kr/day per cat');
    hostProfile.maxCats().should('exist').and('include.text', 'Maximum cats: 3');
    hostProfile.availability().should('exist');
    const dates = [23, 24, 25, 26, 27, 28, 29];
    dates.forEach((date) => {
      hostProfile.availabilityDate(`Sep ${date}, 2019`).should('have.attr', 'aria-selected', 'true');
    });
  });
});

describe('Editing host profile', () => {
  it('can edit description', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json', hostProfileUpdate: true });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.description().should('include.text', 'this is a description about me!!!!');
    hostProfile.change('description');
    hostProfile.new('description', 'Brand new description, yo');
    hostProfile.submitUpdated('description');
    hostProfile.description().should('include.text', 'Brand new description, yo');
  });

  it('can close edited description without saving', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.description().should('include.text', 'this is a description about me!!!!');
    hostProfile.change('description');
    hostProfile.new('description', 'Brand new description, yo');
    hostProfile.closeUpdateForm('description');
    hostProfile.description().should('include.text', 'this is a description about me!!!!');
  });

  it('can not save an empty description', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.description().should('include.text', 'this is a description about me!!!!');
    hostProfile.change('description');
    hostProfile.clearField('description');
    hostProfile.submitUpdated('description');
    hostProfile.error('description').should('exist').and('have.text', 'Please enter a description about yourself');
  });

  it('can edit address - city same as in settings', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json', hostProfileUpdate: true });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.address().should('include.text', 'Charles de Gaulle Airport (CDG), 95700 Roissy-en-France, France');
    hostProfile.change('address');
    hostProfile.new('address', 'Södermalm');
    hostProfile.submitUpdated('address');
    hostProfile.address().should('include.text', 'Södermalm');
  });

  it('can edit address - city different from settings', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json', hostProfileUpdate: true });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.address().should('include.text', 'Charles de Gaulle Airport (CDG), 95700 Roissy-en-France, France');
    hostProfile.change('address');
    hostProfile.new('address', 'Göteborg');
    hostProfile.submitUpdated('address');
    assert.confirm(
      'It seems that the address you selected does not match your profile location. Are you sure you want to continue?'
    );
    hostProfile.address().should('include.text', 'Göteborg');
  });

  it('can not save blank address', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json', hostProfileUpdate: true });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.address().should('include.text', 'Charles de Gaulle Airport (CDG), 95700 Roissy-en-France, France');
    hostProfile.change('address');
    hostProfile.clearField('address');
    hostProfile.submitUpdated('address');
    hostProfile.error('address').should('exist').and('have.text', 'Please enter your address');
  });

  it('can close without saving new address', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json', hostProfileUpdate: true });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.address().should('include.text', 'Charles de Gaulle Airport (CDG), 95700 Roissy-en-France, France');
    hostProfile.change('address');
    hostProfile.new('address', 'Göteborg');
    hostProfile.closeUpdateForm('address');
    hostProfile.address().should('include.text', 'Charles de Gaulle Airport (CDG), 95700 Roissy-en-France, France');
  });

  it('can edit rate', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json', hostProfileUpdate: true });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.rate().should('include.text', '100 kr/day for 1 cat');
    hostProfile.change('rate');
    hostProfile.new('rate', '666');
    hostProfile.submitUpdated('rate');
    hostProfile.rate().should('include.text', '666 kr/day for 1 cat');
  });

  it('can close edited rate without saving', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.rate().should('include.text', '100 kr/day for 1 cat');
    hostProfile.change('rate');
    hostProfile.new('rate', '666');
    hostProfile.closeUpdateForm('rate');
    hostProfile.rate().should('include.text', '100 kr/day for 1 cat');
  });

  it('can not save an empty rate', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.rate().should('include.text', '100 kr/day for 1 cat');
    hostProfile.change('rate');
    hostProfile.clearField('rate');
    hostProfile.submitUpdated('rate');
    hostProfile.error('rate').should('exist').and('have.text', 'Please enter your daily rate');
  });

  it('can edit supplement', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json', hostProfileUpdate: true });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.supplement().should('include.text', 'Extra 35 kr/day per cat');
    hostProfile.change('supplement');
    hostProfile.new('supplement', '66');
    hostProfile.submitUpdated('supplement');
    hostProfile.supplement().should('include.text', 'Extra 66 kr/day per cat');
  });

  it('can close edited supplement without saving', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.supplement().should('include.text', 'Extra 35 kr/day per cat');
    hostProfile.change('supplement');
    hostProfile.new('supplement', '666');
    hostProfile.closeUpdateForm('supplement');
    hostProfile.supplement().should('include.text', 'Extra 35 kr/day per cat');
  });

  it('can not save an empty supplement', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.supplement().should('include.text', 'Extra 35 kr/day per cat');
    hostProfile.change('supplement');
    hostProfile.clearField('supplement');
    hostProfile.submitUpdated('supplement');
    hostProfile.error('supplement').should('exist').and('have.text', 'Please enter your daily supplement for one cat');
  });

  it('can edit max cats', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json', hostProfileUpdate: true });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.maxCats().should('include.text', 'Maximum cats: 3');
    hostProfile.change('maxCats');
    hostProfile.new('max-cats', '5');
    hostProfile.submitUpdated('max-cats');
    hostProfile.maxCats().should('include.text', 'Maximum cats: 5');
  });

  it('can close edited max cats without saving', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.maxCats().should('include.text', 'Maximum cats: 3');
    hostProfile.change('maxCats');
    hostProfile.new('max-cats', '5');
    hostProfile.closeUpdateForm('max-cats');
    hostProfile.maxCats().should('include.text', 'Maximum cats: 3');
  });

  it('can not save an empty max cats field', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    hostProfile.maxCats().should('include.text', 'Maximum cats: 3');
    hostProfile.change('maxCats');
    hostProfile.clearField('max-cats');
    hostProfile.submitUpdated('max-cats');
    hostProfile
      .error('max-cats')
      .should('exist')
      .and('have.text', 'Please enter the max amount of cats you can host at the same time');
  });

  it('can edit availability', () => {
    const now = new Date(2019, 8, 1).getTime();
    const initiallySelectedDates = [23, 24, 25, 26, 27, 28, 29];
    const extraDates = [20, 21, 22];
    const merged = [...initiallySelectedDates, ...extraDates];

    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json', hostProfileUpdate: true });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    cy.clock(now);
    initiallySelectedDates.forEach((date) => {
      hostProfile.availabilityDate(`Sep ${date}, 2019`).should('have.attr', 'aria-selected', 'true');
    });
    hostProfile.change('availability');
    extraDates.forEach((date) => {
      hostProfile.availabilityDate(`Sep ${date}, 2019`).click();
    });
    hostProfile.submitUpdated('availability');
    merged.forEach((date) => {
      hostProfile.availabilityDate(`Sep ${date}, 2019`).should('have.attr', 'aria-selected', 'true');
    });
  });

  it('can close without saving availability', () => {
    const now = new Date(2019, 8, 1).getTime();
    const initiallySelectedDates = [23, 24, 25, 26, 27, 28, 29];
    const extraDates = [20, 21, 22];

    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json', hostProfileUpdate: true });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    cy.clock(now);
    initiallySelectedDates.forEach((date) => {
      hostProfile.availabilityDate(`Sep ${date}, 2019`).should('have.attr', 'aria-selected', 'true');
    });
    hostProfile.change('availability');
    extraDates.forEach((date) => {
      hostProfile.availabilityDate(`Sep ${date}, 2019`).click();
    });
    hostProfile.closeUpdateForm('availability');
    extraDates.forEach((date) => {
      hostProfile.availabilityDate(`Sep ${date}, 2019`).should('have.attr', 'aria-selected', 'false');
    });
    initiallySelectedDates.forEach((date) => {
      hostProfile.availabilityDate(`Sep ${date}, 2019`).should('have.attr', 'aria-selected', 'true');
    });
  });
});

describe('Creating host profile', () => {
  it('without logging in', () => {
    nav.createHostProfile();
    login.loginForm().should('exist');
    createHostProfile.wrapper().should('not.exist');
  });
});

// describe('User can view their profile page - happy path', () => {
//   beforeEach(function () {
//     loadUserPageAPICalls();
//     cy.login('login/successful.json', 'george@mail.com', 'password', 200);
//     nav.to.userPage();
//   });

//   it('and deletes their account - no upcoming and request bookings - no host profile exists', () => {
//     deviseAuthRoute('DELETE', 200, 'fixture:successful_account_deletion.json');
//     getBookingStats('0', '0', '2', '0', '0', '0', '3', '0');
//     cy.get('#delete-account-link').click();
//     checkWindowConfirm();
//     checkWindowAlert('Your account was succesfully deleted!');
//     cy.contains('Welcome to KattBNB!').should('exist');
//   });

//   it('and cannot delete their account cause of upcoming and request bookings', () => {
//     getBookingStats('0', '1', '2', '0', '1', '0', '3', '0');
//     cy.get('#delete-account-link').click();
//     checkWindowAlert('To delete your account, you must not have any pending or unpaid bookings!');
//     cy.location('pathname').should('eq', '/user-page');
//   });
// });

// describe('User can view their profile page', () => {
//   it('and delete their account - host profile exists - no Stripe errors', () => {
//     deleteAccountAPICalls();
//     stripeCall(200, { message: 'Success!' });
//     cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
//     cy.get('#user-icon').click({ force: true });
//     cy.get('#delete-account-link').click();
//     checkWindowConfirm();
//     checkWindowAlert('Your account was succesfully deleted!');
//     cy.contains('Welcome to KattBNB!').should('exist');
//   });
// });

// describe('User can view their profile page', () => {
//   it('and cannot delete their account - host profile exists - Stripe errors', () => {
//     deleteAccountAPICalls();
//     stripeCall(555, { error: 'No success!' });
//     cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
//     cy.get('#user-icon').click({ force: true });
//     cy.get('#delete-account-link').click();
//     checkWindowConfirm();
//     cy.contains(
//       'Make sure your Stripe account balance is 0 and try again. If this error persists, please contact our support staff.'
//     ).should('exist');
//   });
// });




// describe('User can create a host profile', () => {
//   beforeEach(() => {
//     cy.server();
//     cy.route({
//       method: 'GET',
//       url: `${host_profiles}?user_id=66&locale=en-US`,
//       status: 200,
//       response: [],
//     });
//     cy.route({
//       method: 'GET',
//       url: `${api}/bookings?dates=only&stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
//       status: 200,
//       response: [],
//     });
//     cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200);
//     cy.get('#user-icon').click({ force: true });
//   });

//   it('successfully', () => {
//     updateProfile(200, 'fixture:successful_host_profile_creation.json');
//     cy.contains(
//       'You are not registered as a cat host and do not appear in the search. If you would like to host cats, please create a host profile.'
//     ).should('exist');
//     cy.get('#createHostProfileForm').click();
//     cy.get('#host-profile-form').within(() => {
//       let text = [
//         ['#description', 'I hate people but I love cats! Nerd life chose me!'],
//         ['#rate', '100'],
//         ['#maxCats', '3'],
//         ['#supplement', '35'],
//       ];
//       text.forEach((element) => {
//         cy.get(element[0]).type(element[1]);
//       });
//     });
//     cy.get('#userInputAddress').type('Solståndsgatan 23');
//     cy.get('#search').click();
//     pickCalendarDates();
//     cy.on('window:alert', (str) => {
//       expect(str).to.equal('You have successfully created your host profile!');
//     });
//   });

//   it('unsuccessfully', () => {
//     updateProfile(422, 'fixture:unsuccessful_host_profile_creation.json');
//     cy.contains(
//       'You are not registered as a cat host and do not appear in the search. If you would like to host cats, please create a host profile.'
//     ).should('exist');
//     cy.get('#createHostProfileForm').click();
//     cy.get('#host-profile-form').within(() => {
//       let text = [
//         ['#rate', '100'],
//         ['#maxCats', '3'],
//         ['#supplement', '250'],
//       ];
//       text.forEach((element) => {
//         cy.get(element[0]).type(element[1]);
//       });
//     });
//     cy.get('#userInputAddress').type('Solståndsgatan 23');
//     cy.get('#search').click();
//     pickCalendarDates();
//     cy.contains("Description can't be blank").should('exist');
//     cy.contains("Supplement price per cat per day can't be blank").should('exist');
//   });
// });
