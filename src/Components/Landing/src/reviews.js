import Responsive from '../../../common/Responsive';
import Spinner from '../../../common/Spinner';

import { Flexbox, Header } from '../../../UI-Components';
import { LandingItem, LandingSection, LandingGrid } from '../styles';
import useReviews from './useReviews';
import Review from './review';

const Reviews = ({ t }) => {
  const { loading, reviews } = useReviews();

  if (loading) return <Spinner />;

  return (
    <LandingSection color={'neutral'} tint={20}>
      <LandingItem>
        <Header level={2} centered>
          {t('Landing:reviews')}
        </Header>
        <Responsive displayIn={['mobile', 'tablet']}>
          reviews on mobile
        </Responsive>
        <Responsive displayIn={['laptop', 'desktop']}>
          <LandingGrid>
            {reviews.map((review) => (
              <Review review={review} t={t} />
            ))}
          </LandingGrid>
        </Responsive>
        <Flexbox></Flexbox>
      </LandingItem>
    </LandingSection>
  );
};

export default Reviews;
