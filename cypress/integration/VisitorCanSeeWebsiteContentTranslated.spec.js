import stubLanguages from '../support/stubLanguages'

describe('User can view the website in their browser detected language', () => {
  beforeEach(() => {
    cy.server(),
    cy.visit('http://localhost:3000')
  })

  it('successfully shows swedish UI', () => {
    stubLanguages(['sv', 'sv-SE'])
    cy.get('h1').should('contain', 'KattBNB kommer snart!')
  })

  it('successfully shows english UI', () => {
    stubLanguages(['en', 'en-GB'])
    cy.get('h1').should('contain', 'KattBNB coming soon!')
  })
})