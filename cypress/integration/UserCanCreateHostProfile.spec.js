describe('User can create a host profile', () => {
  beforeEach(function () {
    cy.server()
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#user-icon').click()
    })
  })
  it('successfully', () => {
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/host_profiles',
      status: 200,
      response: 'fixture:successful_host_profile_creation.json'
    })
    cy.contains('You are not registered as a cat host and do not appear in the search. If you would like to host cats, please create a host profile.')
    cy.get('#create-host-profile-button').click()
    cy.get('#host-profile-form').within(() => {

      let text = [
        ['#description', 'I hate people but I love cats! Nerd life chose me!'],
        ['#rate', '100'],
        ['#maxCats', '3'],
        ['#supplement', '35']
      ]

      text.forEach(element => {
        cy.get(element[0]).type(element[1])
      })
    })

    cy.get('#user_input_address').type('Solståndsgatan 23')
    cy.get('#search').click()
    cy.get('.required > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(2)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(4)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(5)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(6)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(7)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(8)').click()
    cy.get('#save-host-profile-button').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('You have successfully created host profile!')
    })
  })

  it('successfully', () => {
    cy.route({
      method: 'POST',
      url: 'http://localhost:3007/api/v1/host_profiles',
      status: 200,
      response: 'fixture:unsuccessful_host_profile_creation.json'
    })
    cy.contains('You are not registered as a cat host and do not appear in the search. If you would like to host cats, please create a host profile.')
    cy.get('#create-host-profile-button').click()
    cy.get('#host-profile-form').within(() => {

      let text = [
        ['#rate', '100'],
        ['#maxCats', '3']
      ]

      text.forEach(element => {
        cy.get(element[0]).type(element[1])
      })
    })

    cy.get('#user_input_address').type('Solståndsgatan 23')
    cy.get('#search').click()
    cy.get('.required > .DayPicker > .DayPicker-wrapper > .DayPicker-NavBar > .DayPicker-NavButton--next').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(2)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(4)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(5)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(6)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(7)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(3) > .DayPicker-Day:nth-child(8)').click()
    cy.get('#save-host-profile-button').click()
    cy.contains("Description can't be blank")
    cy.contains("Supplement price per cat per day can't be blank")
  })
})