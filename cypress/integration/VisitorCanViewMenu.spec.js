describe('Visitor can view menu', () => {
  beforeEach(function () {
    cy.server()
    cy.visit('http://localhost:3000/')
  })

  it('and can toggle visibility by clicking on the hamburger', () => {
    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
    cy.get('#menu').should('be.visible')
    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
    cy.get('#menu').should('not.be.visible')
  })

  it('and can see links to different homepage sections', () => {
    let links = ['Login', 'Sign up', 'About us', 'Legal', 'FAQ', 'Contact us', 'Blog']
    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
    links.forEach(link => {
      cy.contains(link)
    })
  })

  it('and can toggle menu visibility off by clicking outside the menu', () => {
    cy.get('#hamburger').within(() => {
      cy.get('.icon').click()
    })
    cy.get('#menu').should('be.visible')
    cy.get('.content-wrapper').click()
    cy.get('#menu').should('not.be.visible')
  })
})
