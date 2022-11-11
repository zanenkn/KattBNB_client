import nav from '../../pages/navigation';
import { reviewsSection } from '../../pages/userPage';
import mockAPI from '../../support/api';

describe('Reviews', () => {
  it('not displayed when user has no reviews', () => {
    mockAPI.userPage({ hostProfile: 'hostProfile/individual.json' });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    reviewsSection.self().should('exist').and('include.text', 'No reviews yet');
  });

  it('reviews are displayed', () => {
    mockAPI.userPage({
      hostProfile: 'hostProfile/individual.json',
      hostProfileModifications: { score: 3.666666666667 },
      reviews: 'hostProfile/few_reviews.json',
    });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    reviewsSection.count().should('exist').and('have.text', '3 reviews received');
    reviewsSection.score().should('exist').and('have.text', '(3.7/5)');
    reviewsSection.wrapper().children().should('have.length', 3);
    reviewsSection
      .wrapper()
      .children()
      .each((review) => {
        const reviewId = review[0].attributes['data-cy'].value;

        reviewsSection.review(reviewId).avatar().should('exist');
        reviewsSection.review(reviewId).name().should('exist');
        reviewsSection.review(reviewId).date().should('exist');
        reviewsSection.review(reviewId).score().should('exist');
        reviewsSection.review(reviewId).body().should('exist');
      });
    reviewsSection.wrapper().children().eq(0).should('have.attr', 'data-cy', 'review-33');
    reviewsSection.wrapper().children().eq(1).should('have.attr', 'data-cy', 'review-11');
    reviewsSection.wrapper().children().eq(2).should('have.attr', 'data-cy', 'review-22');
  });

  it('unanswered review is displayed correctly', () => {
    mockAPI.userPage({
      hostProfile: 'hostProfile/individual.json',
      hostProfileModifications: { score: 3.666666666667 },
      reviews: 'hostProfile/few_reviews.json',
    });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    reviewsSection.review('review-11').avatar().should('exist');
    reviewsSection.review('review-11').name().should('exist').and('have.text', 'Zane');
    reviewsSection.review('review-11').date().should('exist');
    reviewsSection.review('review-11').score().should('exist').and('include.text', '(5/5)');
    reviewsSection.review('review-11').body().should('exist').and('have.text', 'Very good host, I recommend!');
    reviewsSection.review('review-11').replyForm().should('exist');
  });

  it('answered review is displayed correctly', () => {
    mockAPI.userPage({
      hostProfile: 'hostProfile/individual.json',
      hostProfileModifications: { score: 3.666666666667 },
      reviews: 'hostProfile/few_reviews.json',
    });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    reviewsSection.review('review-33').avatar().should('exist');
    reviewsSection.review('review-33').name().should('exist').and('have.text', 'Boa');
    reviewsSection.review('review-33').date().should('exist');
    reviewsSection.review('review-33').score().should('exist').and('include.text', '(2/5)');
    reviewsSection.review('review-33').body().should('exist').and('have.text', 'A bad review for the sake of it');
    reviewsSection.review('review-33').reply().should('exist');
    reviewsSection.review('review-33').replierAvatar().should('exist');
    reviewsSection.review('review-33').replierName().should('exist').and('have.text', 'GeorgeTheGreek');
    reviewsSection.review('review-33').replyDate().should('exist');
    reviewsSection.review('review-33').replyBody().should('exist').and('have.text', 'Sorry you feel that way!');
  });

  it('unanswered review can be replied', () => {
    mockAPI.userPage({
      hostProfile: 'hostProfile/individual.json',
      hostProfileModifications: { score: 3.666666666667 },
      reviews: 'hostProfile/few_reviews.json',
      replyReview: 11,
    });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    reviewsSection.review('review-11').replyCTA().click();
    reviewsSection.review('review-11').replyInput().type('Thank you <3');
    reviewsSection.review('review-11').submitReply();
    reviewsSection.review('review-11').replyErrors().should('not.exist');
  });

  it('reply can not be longer than 1000 characters', () => {
    mockAPI.userPage({
      hostProfile: 'hostProfile/individual.json',
      hostProfileModifications: { score: 3.666666666667 },
      reviews: 'hostProfile/few_reviews.json',
    });
    cy.login('login/successful.json', 'george@mail.com', 'password', 200);
    nav.to.userPage();
    reviewsSection.review('review-11').replyCTA().click();
    reviewsSection.review('review-11').replyInput().type('Thank you <3 '.repeat(100));
    reviewsSection.review('review-11').submitReply();
    reviewsSection
      .review('review-11')
      .replyErrors()
      .should('exist')
      .and('have.text', 'Reply cannot exceed 1000 characters!');
  });
});
