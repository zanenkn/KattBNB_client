describe('Visitor can view menu', () => {
  beforeEach(function () {
		cy.server()
		cy.visit('http://localhost:3000/')
  })
  
  it('and can toggle visibility by clicking on the hamburger', () => {
    cy.find('#hamburger').click()
    cy.find('#menu').should('be.visible')
    cy.find('#hamburger').click()
    cy.find('#menu').should('not.be.visible')
  })

  it('and can see links to different homepage sections', () => {
    let links = ['Login', 'Sign up', 'About us', 'Legal', 'FAQ', 'Contact us', 'Blog']
    cy.find('#hamburger').click()
    links.forEach(link => {
      cy.contains(link)
    })
  })

  it('and can toggle menu visibility off by clicking outside the menu', () => {
    cy.find('#hamburger').click()
    cy.find('#menu').should('be.visible')
    cy.find('#app-content').click()
    cy.find('#menu').should('not.be.visible')
  })
})