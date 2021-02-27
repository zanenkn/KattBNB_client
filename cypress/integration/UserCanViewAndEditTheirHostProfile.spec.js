const api = 'http://localhost:3007/api/v1';

function updateHostProfile() {
  cy.server();
  cy.route({
    method: 'PATCH',
    url: `${api}/host_profiles/1`,
    status: 200,
    response: 'fixture:successful_host_profile_update.json',
  });
}

function checkWindowAlert(text) {
  cy.on('window:alert', (str) => {
    expect(str).to.equal(text);
  });
}

describe('User can view their host profile', () => {
  before(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles?user_id=66&locale=en-US`,
      status: 200,
      response: 'fixture:host_profile_index.json',
    });
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles/1?locale=en-US`,
      status: 200,
      response: 'fixture:host_profile_individual.json',
    });
    cy.route({
      method: 'GET',
      url: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=retrieve`,
      status: 200,
      response: { message: 'No account' },
    });
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
    cy.get('#user-icon').click({ force: true });
  });

  it('and see the saved information', () => {
    let text = [
      ['#description', 'this is a description about me!!!!'],
      ['#address', 'Charles de Gaulle Airport'],
      ['#rate', '100 kr/day for 1 cat'],
      ['#maxCats', 'Maximum cats: 3'],
      ['#supplement', 'Extra 35 kr/day per cat'],
    ];
    text.forEach((element) => {
      cy.get(element[0]).contains(element[1]);
    });
    cy.contains('September 2019');
  });

  it('and change description successfully', () => {
    updateHostProfile();
    cy.contains('This is my new description!!!').should('not.exist');
    cy.get('#editDescriptionForm').click();
    cy.get('#newDescription').clear();
    cy.get('#newDescription').type('This is my new description!!!');
    cy.get('#description-submit-button').click();
    checkWindowAlert('Your description was succesfully updated!');
  });

  it('and change maximum accepted cats successfully', () => {
    updateHostProfile();
    cy.contains('Maximum cats: 5').should('not.exist');
    cy.get('#editMaxCatsForm').click();
    cy.get('#newMaxCats').clear();
    cy.get('#newMaxCats').type('5');
    cy.get('#maxCats-submit-button').click();
    checkWindowAlert('Your maximum amount of cats accepted was succesfully updated!');
  });

  it('and change daily rate successfully', () => {
    updateHostProfile();
    cy.contains('120 kr/day for 1 cat').should('not.exist');
    cy.get('#editRateForm').click();
    cy.get('#newRate').clear();
    cy.get('#newRate').type('120');
    cy.get('#rate-submit-button').click();
    checkWindowAlert('Your daily rate for 1 cat was succesfully updated!');
  });

  it('and change supplement rate successfully', () => {
    updateHostProfile();
    cy.contains('Extra 20 kr/day per cat').should('not.exist');
    cy.get('#editSupplementForm').click();
    cy.get('#newSupplement').clear();
    cy.get('#newSupplement').type('20');
    cy.get('#supplement-submit-button').click();
    checkWindowAlert('Your supplement rate for 1 cat was succesfully updated!');
  });

  it('and change address successfully', () => {
    updateHostProfile();
    cy.contains('Stockholm Arlanda Airport (ARN), 190 45 Stockholm-Arlanda, Sweden').should('not.exist');
    cy.get('#editAddress').click();
    cy.get('#userInputAddress').clear();
    cy.get('#userInputAddress').type('arlanda airport');
    cy.get('#search').click();
    cy.wait(500);
    cy.get('#address-submit-button').click();
    checkWindowAlert('Your address was succesfully updated!');
  });

  it('and see correct amount of reviews sorted by date - latest first', () => {
    cy.contains('My reviews').should('exist');
    cy.get('#all-reviews').children().first().should('have.id', 'review-33');
    cy.get('#all-reviews').children().last().should('have.id', 'review-22');
    cy.get('#all-reviews').children().should('have.length', '3');
  });

  it('and see host profile score displayed', () => {
    cy.contains('3.7/5').should('exist');
  });

  it("and get a reply form to open when clicking 'Reply'", () => {
    cy.get('#review-33 > .fake-link-underlined').click();
    cy.get('#host-reply')
      .should('have.attr', 'placeholder')
      .should('contain', 'Here, you can reply to a review another user has left for you..');
  });

  it('and unsuccessfully reply to a review cause of no text or text > 1000 characters', () => {
    cy.get('#host-reply-submit-button').click();
    cy.contains('Reply cannot be empty!');
    cy.get('#host-reply').type(
      'enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters and that is very bad apparently'
    );
    cy.get('#host-reply-submit-button').click();
    cy.contains('Reply cannot exceed 1000 characters!');
  });

  it('and successfully reply to a review', () => {
    cy.server();
    cy.route({
      method: 'PATCH',
      url: `${api}/reviews/33`,
      status: 200,
      response: '',
    });
    cy.route({
      method: 'GET',
      url: `${api}/reviews?host_profile_id=1&locale=en-US`,
      status: 200,
      response: 'fixture:one_user_reviews.json',
    });
    cy.get('#host-reply').clear();
    cy.get('#host-reply').type('Very satisfied.');
    cy.get('#host-reply-submit-button').click();
    checkWindowAlert('You have successfully replied.');
  });

  it('and change availability dates successfully', () => {
    updateHostProfile();
    cy.get('#editableCalendar').click();
    cy.get('.DayPicker-NavButton--next').click();
    cy.get(
      '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(2)'
    ).click();
    cy.get(
      '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(3)'
    ).click();
    cy.get('#availability-submit-button').click();
    checkWindowAlert('Your availability was succesfully updated!');
  });
});
