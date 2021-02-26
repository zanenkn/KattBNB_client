const api = 'http://localhost:3007/api/v1';
const host_profiles = `${api}/host_profiles`;

function updateProfile(status, response){
  cy.route({
    method: 'POST',
    url: `${host_profiles}`,
    status: status,
    response: response,
  });
}

function pickCalendarDates(){
  cy.get('.required > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click();
  cy.get(
    '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(2)'
  ).click();
  cy.get(
    '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(3)'
  ).click();
  cy.get(
    '.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(8)'
  ).click();
  cy.get('#save-host-profile-button').click();
}

describe('User can create a host profile', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: `${host_profiles}?user_id=66&locale=en-US`,
      status: 200,
      response: [],
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

  it('successfully', () => {
    updateProfile(200, 'fixture:successful_host_profile_creation.json');
    cy.contains(
      'You are not registered as a cat host and do not appear in the search. If you would like to host cats, please create a host profile.'
    );
    cy.get('#createHostProfileForm').click();
    cy.get('#host-profile-form').within(() => {
      let text = [
        ['#description', 'I hate people but I love cats! Nerd life chose me!'],
        ['#rate', '100'],
        ['#maxCats', '3'],
        ['#supplement', '35'],
      ];

      text.forEach((element) => {
        cy.get(element[0]).type(element[1]);
      });
    });

    cy.get('#userInputAddress').type('Solståndsgatan 23');
    cy.get('#search').click();
    pickCalendarDates();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('You have successfully created your host profile!');
    });
  });

  it('unsuccessfully', () => {
    updateProfile(422, 'fixture:unsuccessful_host_profile_creation.json');
    cy.contains(
      'You are not registered as a cat host and do not appear in the search. If you would like to host cats, please create a host profile.'
    );
    cy.get('#createHostProfileForm').click();
    cy.get('#host-profile-form').within(() => {
      let text = [
        ['#rate', '100'],
        ['#maxCats', '3'],
        ['#supplement', '250'],
      ];

      text.forEach((element) => {
        cy.get(element[0]).type(element[1]);
      });
    });

    cy.get('#userInputAddress').type('Solståndsgatan 23');
    cy.get('#search').click();
    pickCalendarDates();
    cy.contains("Description can't be blank");
    cy.contains("Supplement price per cat per day can't be blank");
  });
});
