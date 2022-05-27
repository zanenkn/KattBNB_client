import { client } from '../support/constants';

class Navigation {
  userAvatar = () => cy.get('[data-cy=user-avatar]');
  visitorAvatar = () => cy.get('[data-cy=visitor-avatar]');
  landing = () => cy.visit(`${client}`);
  userPage = () => cy.visit(`${client}/user-page`);
  createHostProfile = () => cy.visit(`${client}/create-host-profile`);
  review = (id) => cy.visit(`${client}/user-page#review-${id}`);

  to = {
    bookings: () => cy.get('[data-cy=nav-bookings]').click({ force: true }),
    login: () => cy.get('[data-cy=nav-login]').click({ force: true }),
    logout: () => cy.get('[data-cy=nav-logout]').click({ force: true }),
    signup: () => cy.get('[data-cy=nav-signup]').click({ force: true }),
    userPage: () => cy.get('[data-cy=nav-user-page]').click({ force: true }),
  };
}

module.exports = new Navigation();
