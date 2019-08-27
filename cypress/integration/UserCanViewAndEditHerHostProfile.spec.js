describe('User can view her host profile', () => {
  beforeEach(function () {
    cy.server()
    cy.login('fixture:successful_login.json', 'george@mail.com', 'password', 200)
    cy.wait(2000)
    cy.get('#navlinks').within(() => {
      cy.get('#user-icon').click()
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3007/host_profile?user_id=1',
      status: 200,
      response: 'fixture:host_profile.json'
    })
  })

  it('and see the saved information', () => {
    let text = [
      ['#description', 'I hate people but I love cats! Nerd life chose me!'], 
      ['#address', 'Solvarvsgatan 32, 415 08 Göteborg, Sweden'], 
      ['#rate', '100 kr/day'], 
      ['#maxCats', '3 cats'], 
      ['#supplement', '35 kr/day per cat'] 
    ]

    text.forEach(element => {
      cy.get(element[0]).contains(element[1])
    })

    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week > .DayPicker-Day--selected:nth-child(7)').should('have.attr', 'aria-selected', 'true')
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week > .DayPicker-Day--selected:nth-child(6)').should('have.attr', 'aria-selected', 'true')
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(4) > .DayPicker-Day--selected').should('have.attr', 'aria-selected', 'true')
  })
})