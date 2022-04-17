import { api } from './constants';

class API {
  userPage = ({
    username = 'GeorgeTheGreek',
    userId = 66,
    hostProfileId = 1,
    hostProfile = false,
    locationChange = false,
    avatarChange = false,
    tokenValidation = false,
  } = {}) => {
    cy.server();

    cy.route({
      method: 'GET',
      url: `${api}/bookings?dates=only&stats=no&host_nickname=${username}&locale=en-US`,
      status: 200,
      response: [],
    });
    cy.route({
      method: 'GET',
      url: `${api}/host_profiles?user_id=${userId}&locale=en-US`,
      status: 200,
      response: hostProfile ? 'fixture:host_profile_index.json' : [],
    });

    hostProfile &&
      cy.route({
        method: 'GET',
        url: `${api}/host_profiles/${hostProfileId}?locale=en-US`,
        status: 200,
        response: hostProfile,
      });

    hostProfile &&
      cy.route({
        method: 'GET',
        url: `${api}/stripe?locale=en-US&host_profile_id=${hostProfileId}&occasion=retrieve`,
        status: 200,
        response: { message: 'No account' },
      });

    hostProfile &&
      cy.route({
        method: 'GET',
        url: `${api}/reviews?host_profile_id=${hostProfileId}&locale=en-US`,
        status: 200,
        response: 'fixture:one_user_reviews.json',
      });

    hostProfile &&
      cy.route({
        method: 'GET',
        url: `${api}/bookings?dates=only&stats=no&host_nickname=${username}&locale=en-US`,
        status: 200,
        response: [],
      });

    locationChange &&
      cy.route({
        method: 'PUT',
        url: `${api}/auth`,
        status: 200,
        response: locationChange,
      });
    tokenValidation &&
      cy.route({
        method: 'GET',
        url: `${api}/auth/validate_token?access-token=undefined&client=undefined&uid=george@mail.com`,
        status: 200,
        response: tokenValidation,
      });

    avatarChange &&
      cy.route({
        method: 'PUT',
        url: `${api}/users/${userId}`,
        status: 200,
        response: [],
      });
      
  };
}

module.exports = new API();
