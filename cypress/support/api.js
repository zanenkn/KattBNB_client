import { api } from './constants';

const defaultLoggedInUser = require('../fixtures/login/successful.json').data;

// function getBookingStats(inR, inU, inH, inUnp, outR, outU, outH, outUnp) {
//   cy.route({
//     method: 'GET',
//     url: `${api}/bookings?stats=yes&user_id=66&host_nickname=GeorgeTheGreek&locale=en-US`,
//     status: 200,
//     response: {
//       stats: {
//         in_requests: inR,
//         in_upcoming: inU,
//         in_history: inH,
//         in_unpaid: inUnp,
//         out_requests: outR,
//         out_upcoming: outU,
//         out_history: outH,
//         out_unpaid: outUnp,
//       },
//     },
//   });
// }

// function deleteAccountAPICalls() {
//   cy.server();
//   cy.route({
//     method: 'GET',
//     url: `${api}/host_profiles?user_id=66&locale=en-US`,
//     status: 200,
//     response: 'fixture:host_profile_index.json',
//   });
//   cy.route({
//     method: 'GET',
//     url: `${api}/host_profiles/1?locale=en-US`,
//     status: 200,
//     response: 'fixture:host_profile_individual.json',
//   });
//   cy.route({
//     method: 'GET',
//     url: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=retrieve`,
//     status: 200,
//     response: { message: 'No account' },
//   });
//   cy.route({
//     method: 'GET',
//     url: `${api}/reviews?host_profile_id=1&locale=en-US`,
//     status: 200,
//     response: 'fixture:one_user_reviews.json',
//   });
//   deviseAuthRoute('DELETE', 200, 'fixture:successful_account_deletion.json');
//   cy.route({
//     method: 'GET',
//     url: `${api}/bookings?dates=only&stats=no&host_nickname=GeorgeTheGreek&locale=en-US`,
//     status: 200,
//     response: [],
//   });
//   getBookingStats('0', '0', '1', '0', '0', '0', '3', '0');
// }

// function stripeCall(status, response) {
//   cy.route({
//     method: 'GET',
//     url: `${api}/stripe?locale=en-US&host_profile_id=1&occasion=delete_account`,
//     status: status,
//     response: response,
//   });
// }

class API {
  userPage = ({
    email = defaultLoggedInUser.email,
    username = defaultLoggedInUser.nickname,
    userId = defaultLoggedInUser.id,
    hostProfileId = 1,
    hostProfile = false,
    hostProfileModifications = {},
    userUpdate = false,
    avatarChange = false,
    tokenValidation = false,
    successfulPasswordChange = false,
    unsuccessfulPasswordChange = false,
    stripeAccount = false,
    hostProfileUpdate = false,
    reviews = false,
    replyReview = false,
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
      cy.fixture(hostProfile).then((fixture) => {
        cy.intercept('GET', `${api}/host_profiles/${hostProfileId}?locale=en-US`, {
          statusCode: 200,
          body: { ...fixture, ...hostProfileModifications },
        });
      });

    hostProfile &&
      !stripeAccount &&
      cy.intercept('GET', `${api}/stripe?locale=en-US&host_profile_id=${hostProfileId}&occasion=retrieve`, {
        statusCode: 200,
        body: { message: 'No account' },
      });

    hostProfile &&
      stripeAccount &&
      cy.intercept('GET', `${api}/stripe?locale=en-US&host_profile_id=${hostProfileId}&occasion=retrieve`, {
        statusCode: 200,
        fixture: stripeAccount,
      });

    hostProfile &&
      reviews &&
      cy.intercept('GET', `${api}/reviews?host_profile_id=${hostProfileId}&locale=en-US`, {
        statusCode: 200,
        fixture: reviews,
      });

    hostProfile &&
      !reviews &&
      cy.intercept('GET', `${api}/reviews?host_profile_id=${hostProfileId}&locale=en-US`, {
        statusCode: 200,
        body: [],
      });

    hostProfile &&
      cy.intercept('GET', `${api}/bookings?dates=only&stats=no&host_nickname=${username}&locale=en-US`, {
        statusCode: 200,
        body: [],
      });

    userUpdate &&
      cy.intercept('PUT', `${api}/auth`, {
        statusCode: 200,
        fixture: userUpdate,
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

    successfulPasswordChange &&
      cy.intercept('PUT', `${api}/auth/password`, {
        statusCode: 200,
        fixture: 'mySettings/password_change.json',
      });

    unsuccessfulPasswordChange &&
      cy.intercept('PUT', `${api}/auth/password`, {
        statusCode: 422,
        body: {
          success: false,
          errors: { current_password: ['is invalid'], full_messages: ['Current password is invalid'] },
        },
      });

    hostProfileUpdate &&
      cy.intercept('PATCH', `${api}/host_profiles/1`, {
        statusCode: 200,
        fixture: 'hostProfile/update.json',
      });

    replyReview &&
      cy.intercept('PATCH', `${api}/reviews/${replyReview}`, {
        statusCode: 200,
        body: '',
      });
  };

  createHostProfile = () => {
    cy.server();
    cy.intercept('POST', `${api}/host_profiles`, {
      statusCode: 200,
      fixture: 'hostProfile/create.json',
    });
  };

  search = ({ from, to, location, cats, resultsPerLocation, results }) => {
    const utcDate = (date) => {
      const newDate = new Date(date);
      const utc = Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate()) + 86400000;
      return new Date(utc).getTime();
    };

    const hostProfilesWithLocation = (fixture) => {
      return cy.intercept(
        'GET',
        `${api}/host_profiles?location=${location}&startDate=${utcDate(from)}&endDate=${utcDate(
          to
        )}&cats=${cats}&locale=en-US`,
        {
          statusCode: 200,
          body: fixture,
        }
      );
    };

    const hostProfiles = (fixture) => {
      cy.intercept(
        'GET',
        `${api}/host_profiles?startDate=${utcDate(from)}&endDate=${utcDate(to)}&cats=${cats}&locale=en-US`,
        {
          statusCode: 200,
          body: fixture,
        }
      );
    };

    cy.server();

    resultsPerLocation
      ? cy.fixture(resultsPerLocation).then((fixture) => {
          hostProfilesWithLocation(fixture);
        })
      : hostProfilesWithLocation({ with: [], without: [] });

    results
      ? cy.fixture(results).then((fixture) => {
          hostProfiles(fixture);
        })
      : hostProfiles({ with: [], without: [] });
  };
}

module.exports = new API();
