import stubLanguages from '../support/stubLanguages'

describe('User can view the website in their browser detected language', () => {

  it('successfully shows swedish UI', () => {
    cy.server(),
    cy.visit(
      "http://localhost:3000",
      stubLanguages(['sv', 'sv-SE'])
    )
    cy.get('h1').should('contain', 'KattBNB kommer snart!')
  })

  it('successfully shows english UI', () => {
    cy.server(),
    cy.visit(
      "http://localhost:3000",
      stubLanguages(['en', 'en-GB'])
    )
    cy.get('h1').should('contain', 'KattBNB is coming soon!')
  })
})