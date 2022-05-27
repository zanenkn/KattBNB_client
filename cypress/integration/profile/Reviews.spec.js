// const api = 'http://localhost:3007/api/v1';

// function updateHostProfile() {
//   cy.server();
//   cy.route({
//     method: 'PATCH',
//     url: `${api}/host_profiles/1`,
//     status: 200,
//     response: 'fixture:successful_host_profile_update.json',
//   });
// }

// function checkWindowAlert(text) {
//   cy.on('window:alert', (str) => {
//     expect(str).to.equal(text);
//   });
// }

// describe('User can view their host profile', () => {
//   before(() => {
//     cy.server();
//     cy.route({
//       method: 'GET',
//       url: `${api}/host_profiles?user_id=66&locale=en-US`,
//       status: 200,
//       response: 'fixture:host_profile_index.json',
//     });
//     cy.route({
//       method: 'GET',
//       url: `${api}/host_profiles/1?locale=en-US`,
//       status: 200,
//       response: 'fixture:host_profile_individual.json',
//     });
//     cy.route({
//       method: 'GET',
//       url: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=retrieve`,
//       status: 200,
//       response: { message: 'No account' },
//     });
//     cy.route({
//       method: 'GET',
//       url: `${api}/reviews?host_profile_id=1&locale=en-US`,
//       status: 200,
//       response: 'fixture:one_user_reviews.json',
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

//   it('and see correct amount of reviews sorted by date - latest first', () => {
//     cy.contains('My reviews').should('exist');
//     cy.get('#all-reviews').children().first().should('have.id', 'review-33');
//     cy.get('#all-reviews').children().last().should('have.id', 'review-22');
//     cy.get('#all-reviews').children().should('have.length', '3');
//   });

//   it('and see host profile score displayed', () => {
//     cy.contains('3.7/5').should('exist');
//   });

//   it("and get a reply form to open when clicking 'Reply'", () => {
//     cy.get('#review-33 > .fake-link-underlined').click();
//     cy.get('#host-reply')
//       .should('have.attr', 'placeholder')
//       .should('contain', 'Here, you can reply to a review another user has left for you..');
//   });

//   it('and unsuccessfully reply to a review cause of no text or text > 1000 characters', () => {
//     cy.get('#host-reply-submit-button').click();
//     cy.contains('Reply cannot be empty!').should('exist');
//     cy.get('#host-reply').type(
//       'enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters  enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters enters more than 1000 characters and that is very bad apparently'
//     );
//     cy.get('#host-reply-submit-button').click();
//     cy.contains('Reply cannot exceed 1000 characters!').should('exist');
//   });

//   it('and successfully reply to a review', () => {
//     cy.server();
//     cy.fixture('one_user_reviews.json').then((reviews) => {
//       reviews[2].host_reply = 'Very satisfied';
//       cy.route({
//         method: 'GET',
//         url: `${api}/reviews?host_profile_id=1&locale=en-US`,
//         status: 200,
//         response: reviews,
//       });
//     });
//     cy.route({
//       method: 'PATCH',
//       url: `${api}/reviews/33`,
//       status: 200,
//       response: '',
//     });
//     cy.get('#host-reply').clear();
//     cy.get('#host-reply').type('Very satisfied.');
//     cy.get('#host-reply-submit-button').click();
//     checkWindowAlert('You have successfully replied.');
//   });
// });
