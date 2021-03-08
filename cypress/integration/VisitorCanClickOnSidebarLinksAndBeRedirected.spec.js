function getElementAndText(element1, element2, text) {
  cy.get(element1).click();
  cy.get(element2).click();
  cy.contains(text).should('exist');
}

describe('Visitor can click on sidebar links and be redirected depending on chosen language', () => {
  it('to ENG Login page', () => {
    cy.visit('http://localhost:3000/');
    getElementAndText('.hamburger-box', '#login', 'Log in');
  });

  it('to ENG Sign Up page', () => {
    cy.get('.hamburger-box').click();
    getElementAndText('#login', '#create-account', 'Sign up');
  });

  it('to ENG About Us page', () => {
    getElementAndText('.hamburger-box', '#about', 'About us');
  });

  it('to ENG Legal page', () => {
    getElementAndText('.hamburger-box', '#legal', 'Terms & conditions');
  });

  it('to ENG FAQ page', () => {
    getElementAndText('.hamburger-box', '#faq', 'FAQ');
  });

  it('to ENG Contact Us page', () => {
    getElementAndText('.hamburger-box', '#contact', 'Contact us');
  });

  it('to SE Login page', () => {
    cy.get('.hamburger-box').click();
    cy.get('#se').click();
    getElementAndText('.hamburger-box', '#login', 'Logga in');
  });

  it('to SE Sign Up page', () => {
    cy.get('.hamburger-box').click();
    getElementAndText('#login', '#create-account', 'Registrera dig');
  });

  it('to SE About Us page', () => {
    getElementAndText('.hamburger-box', '#about', 'Om oss');
  });

  it('to SE Legal page', () => {
    getElementAndText('.hamburger-box', '#legal', 'Användarvillkor');
  });

  it('to SE FAQ page', () => {
    getElementAndText('.hamburger-box', '#faq', 'Frågor och svar');
  });

  it('to SE Contact Us page', () => {
    getElementAndText('.hamburger-box', '#contact', 'Kontakta oss');
  });
});
