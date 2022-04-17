import { api } from './constants';

const defaultLoggedInUser = require('../fixtures/login/successful.json').data;

class API {
  userPage = ({
    email = defaultLoggedInUser.email,
    username = defaultLoggedInUser.nickname,
    userId = defaultLoggedInUser.id,
    hostProfileId = 1,
    hostProfile = false,
    locationChange = false,
    avatarChange = false,
    tokenValidation = false,
  } = {}) => {
    
    cy.server();

    cy.intercept('GET', `${api}/bookings?dates=only&stats=no&host_nickname=${username}&locale=en-US`, {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', `${api}/host_profiles?user_id=${userId}&locale=en-US`, {
      statusCode: 200,
      fixture: hostProfile ? 'host_profile_index.json' : false,
      body: !hostProfile ? [] : false,
    });

    hostProfile &&
      cy.intercept('GET', `${api}/host_profiles/${hostProfileId}?locale=en-US`, {
        statusCode: 200,
        fixture: hostProfile,
      });

    hostProfile &&
      cy.intercept('GET', `${api}/stripe?locale=en-US&host_profile_id=${hostProfileId}&occasion=retrieve`, {
        statusCode: 200,
        body: { message: 'No account' },
      });

    hostProfile &&
      cy.intercept('GET', `${api}/reviews?host_profile_id=${hostProfileId}&locale=en-US`, {
        statusCode: 200,
        fixture: 'one_user_reviews.json',
      });

    hostProfile &&
      cy.intercept('GET', `${api}/bookings?dates=only&stats=no&host_nickname=${username}&locale=en-US`, {
        statusCode: 200,
        body: [],
      });

    locationChange &&
      cy.intercept('PUT', `${api}/auth`, {
        statusCode: 200,
        fixture: locationChange,
      });

    tokenValidation &&
      cy.intercept('GET', `${api}/auth/validate_token?access-token=undefined&client=undefined&uid=${email}`, {
        statusCode: 200,
        fixture: tokenValidation,
      });

    avatarChange &&
      cy.intercept('PUT', `${api}/users/${userId}`, {
        statusCode: 200,
        body: [],
      });
  };
}

module.exports = new API();
