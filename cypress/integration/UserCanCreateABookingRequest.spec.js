const api_url = 'http://localhost:3007/api/v1'

function fillInStripeForm() {
  const input = [
    ['cardnumber', '4242424242424242'],
    ['exp-date', '1250'],
    ['cvc', '123'],
  ]
  cy.wait(1000)
  cy.get('.__PrivateStripeElement > iframe').each(($element, index) => {
    cy.get($element).then(($iframe) => {
      const body = $iframe.contents().find('body')
      cy.wrap(body)
        .find(`input[name=${input[index][0]}]`)
        .type(input[index][1], { delay: 10 })
    })
  })
}

describe('User can create a booking request', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'GET',
      url: `${api_url}/host_profiles?location=Stockholm&startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`,
      status: 200,
      response: 'fixture:search_results_list.json'
    })
    cy.route({
      method: 'GET',
      url: `${api_url}/host_profiles?user_id=2&locale=en-US`,
      status: 200,
      response: 'fixture:host_profile_datapoint_click_map.json'
    })
    cy.route({
      method: 'GET',
      url: `${api_url}/host_profiles?startDate=1570492800000&endDate=1570752000000&cats=2&locale=en-US`,
      status: 200,
      response: ''
    })
    cy.route({
      method: 'GET',
      url: `${api_url}/reviews?host_profile_id=2&locale=en-US`,
      status: 200,
      response: []
    })
    cy.route({
      method: 'POST',
      url: `${api_url}/bookings`,
      status: 200,
      response: 'fixture:successful_host_profile_creation.json'
    })
    cy.route({
      method: 'DELETE',
      url: `${api_url}/auth/sign_out`,
      status: 200,
      response: 'fixture:successful_signout.json'
    })
    cy.route({
      method: 'GET',
      url: `${api_url}/stripe?locale=en-US&occasion=create_payment_intent&amount=560&currency=sek`,
      status: 200,
      response: { "intent_id": "pi_1He23jC7F7FPrB6NqKv8uZWy_secret_o2hSyF1hZItV0l1IlOFQM55OK" }
    })
    cy.route({
      method: 'GET',
      url: `${api_url}/stripe?occasion=update_payment_intent&locale=en-US&number_of_cats=2&message=Please take my cats for 4 days!&dates=1570492800000,1570579200000,1570665600000,1570752000000&host_nickname=carla&price_per_day=140&price_total=560&user_id=1&payment_intent_id=pi_1He23jC7F7FPrB6NqKv8uZWy_secret_o2hSyF1hZItV0l1IlOFQM55OK`,
      status: 200,
      response: {}
    })
    cy.route({
      method: 'POST',
      url: `${api_url}/auth/sign_in`,
      status: 200,
      response: 'fixture:successful_login.json',
      headers: {
        'uid': 'george@mail.com',
      }
    })
    cy.visit('http://localhost:3000/search')
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.get('.hamburger-box').click()
    cy.get('#login').click()
    cy.get('#login-form').within(() => {
      cy.get('#email').type('george@mail.com')
      cy.get('#password').type('password')
    })
    cy.get('.submit-button').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2')
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)').last().click()
    cy.clock().then((clock) => {
      clock.restore()
    })
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true })
  })

  it('successfully and get redirected', () => {
    cy.get('#22').click()
    cy.get('#more').click()
    cy.get('#request-to-book').click()
    cy.get('#message').type('Please take my cats for 4 days!')
    cy.get('#cardholderName').type('George')
    fillInStripeForm()
    cy.get('#postalCode').type('15987')
    cy.get('#request-to-book-button').click()
    cy.contains('Your payment is being processed')
  })

  it('unsuccessfully and get an error message cause message field is empty', () => {
    cy.get('#22').click()
    cy.get('#more').click()
    cy.get('#request-to-book').click()
    cy.get('#request-to-book-button').click()
    cy.contains('Please write a message to the host!')
  })

  it('unsuccessfully and get an error message cause message field contains more than 400 characters', () => {
    cy.get('#22').click()
    cy.get('#more').click()
    cy.get('#request-to-book').click()
    cy.get('#message').type('Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!Please take my cats for 4 days!')
    cy.get('#request-to-book-button').click()
    cy.contains('The message cannot exceed 400 characters!')
  })

  it('unsuccessfully and get an error message cause postal code does not consist of 5 numbers', () => {
    cy.get('#22').click()
    cy.get('#more').click()
    cy.get('#request-to-book').click()
    cy.get('#message').type('Please take my cats for 4 days!')
    cy.get('#cardholderName').type('George')
    cy.get('#postalCode').type('123654')
    cy.get('#request-to-book-button').click()
    cy.contains('You have to provide both the cardholder name and a valid postal code!')
  })

  it('unsuccessfully and get an error message cause cardholder name is not filled in', () => {
    cy.get('#22').click()
    cy.get('#more').click()
    cy.get('#request-to-book').click()
    cy.get('#message').type('Please take my cats for 4 days!')
    cy.get('#postalCode').type('13654')
    cy.get('#request-to-book-button').click()
    cy.contains('You have to provide both the cardholder name and a valid postal code!')
  })

  it('unsuccessfully and get an error alert cause of Stripe error while creating the payment intent and get redirected to search with all criteria prefilled', () => {
    cy.route({
      method: 'GET',
      url: `${api_url}/stripe?locale=en-US&occasion=create_payment_intent&amount=560&currency=sek`,
      status: 555,
      response: {}
    })
    cy.get('#22').click()
    cy.get('#more').click()
    cy.get('#request-to-book').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('There was a problem connecting to our payments infrastructure provider. Please make your booking request again.')
    })
    cy.location('pathname').should('eq', '/search')
    cy.contains('Stockholm')
    cy.contains('2')
    cy.get(':nth-child(2) > .DayPickerInput > input').should('have.value', 'October 8, 2019')
    cy.get('[style="margin-top: 0.5em;"] > .DayPickerInput > input').should('have.value', 'October 11, 2019')
  })

  it('unsuccessfully and get an error message cause of Stripe error while updating the payment intent', () => {
    cy.route({
      method: 'GET',
      url: `${api_url}/stripe?occasion=update_payment_intent&locale=en-US&number_of_cats=2&message=Please take my cats for 4 days!&dates=1570492800000,1570579200000,1570665600000,1570752000000&host_nickname=carla&price_per_day=140&price_total=560&user_id=1&payment_intent_id=pi_1He23jC7F7FPrB6NqKv8uZWy_secret_o2hSyF1hZItV0l1IlOFQM55OK`,
      status: 555,
      response: { "error": "There was a problem connecting to our payments infrastructure provider. Please try again later." }
    })
    cy.get('#22').click()
    cy.get('#more').click()
    cy.get('#request-to-book').click()
    cy.get('#message').type('Please take my cats for 4 days!')
    cy.get('#cardholderName').type('George')
    cy.get('#postalCode').type('15987')
    cy.get('#request-to-book-button').click()
    cy.contains('There was a problem connecting to our payments infrastructure provider. Please try again later.')
  })

  it('only if she is logged in or she will be redirected to the log in page', () => {
    cy.get('.hamburger-box').click()
    cy.get('#logout').click()
    cy.get('.landing-desktop-content > [style="width: 165px;"] > [href="/search"] > .ui').click()
    const now = new Date(2019, 9, 1).getTime()
    cy.clock(now)
    cy.get('.ui > #search-form > .required > #location > .default').click()
    cy.get('.ui > #search-form > .required > #location > .search').type('Stock')
    cy.get('#search-form > .required > #location > .visible > .selected').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').click()
    cy.get('.ui > #search-form > .required > .ui > #cats').type('2')
    cy.get('#search-form > .required > .InputFromTo:nth-child(2) > .DayPickerInput > input').click({ force: true })
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(3)').click()
    cy.get('.DayPicker-Months > .DayPicker-Month > .DayPicker-Body > .DayPicker-Week:nth-child(2) > .DayPicker-Day:nth-child(6)').last().click()
    cy.get('.content-wrapper > .ui > .button-wrapper > div > #search-button').click({ force: true })
    cy.get('#22').click()
    cy.get('#more').click()
    cy.get('#request-to-book').click()
    cy.contains('Log in')
  })
})
