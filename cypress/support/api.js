import { api } from './constants';

class API {
  userPageNoHostProfile = () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${api}/bookings?dates=only&stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: [],
    });
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles?user_id=66&locale=en-US`,
      status: 200,
      response: [],
    });
  };

  userPageWithHostProfile = () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${api}/bookings?dates=only&stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
      status: 200,
      response: [],
    });
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
  };
}

module.exports = new API();
