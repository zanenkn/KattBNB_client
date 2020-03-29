describe('Visitor can view menu', () => {
  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000/')
  })

  it('and can toggle visibility by clicking on the hamburger', () => {
    cy.get('.hamburger-box').click()
    cy.get('#menu').should('be.visible')
    cy.get('.hamburger-box').click()
    cy.get('#menu').should('not.be.visible')
  })

  it('and can see links to different homepage sections in ENG', () => {
    let links = ['Log in', 'Sign up', 'About us', 'Legal', 'FAQ', 'Contact us']
    cy.get('.hamburger-box').click()
    links.forEach(link => {
      cy.contains(link)
    })
  })

  it('and can see links to different homepage sections in SE', () => {
    let links = ['Logga in', 'Registrera', 'Om oss', 'Frågor och svar', 'Kontakta oss', 'Policy']
    cy.get('.hamburger-box').click()
    cy.get('#se').click()
    cy.get('.hamburger-box').click()
    links.forEach(link => {
      cy.contains(link)
    })
  })

  it('and can toggle menu visibility off by clicking outside the menu', () => {
    cy.get('.hamburger-box').click()
    cy.get('#menu').should('be.visible')
    cy.get('.content-wrapper').click()
    cy.get('#menu').should('not.be.visible')
  })
})
