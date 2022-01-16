import { useState } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Responsive from '../../../common/Responsive';
import Spinner from '../../../common/Spinner';

import { Flexbox, Header } from '../../../UI-Components';
import { LandingItem, LandingSection, LandingGrid } from '../styles';

import useReviews from './useReviews';
import Review from './review';

const Reviews = ({ t }) => {
  const [prevSlide, setPrevSlide] = useState(0);
  const { loading, reviews } = useReviews();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnFocus: true,
    arrows: false,
  };

  if (loading) return <Spinner />;

  return (
    <LandingSection color={'neutral'} tint={20}>
      <LandingItem>
        <Header level={2} centered>
          {t('Landing:reviews')}
        </Header>
        <Responsive displayIn={['mobile', 'tablet']}>
          <Slider {...settings} beforeChange={(prev) => setPrevSlide(prev)}>
            {reviews.map((review, i) => (
              <Review review={review} t={t} key={review.id} prevSlide={prevSlide} index={i} />
            ))}
          </Slider>
        </Responsive>
        <Responsive displayIn={['laptop', 'desktop']}>
          <LandingGrid>
            {reviews.map((review) => (
              <Review review={review} t={t} key={review.id} />
            ))}
          </LandingGrid>
        </Responsive>
        <Flexbox></Flexbox>
      </LandingItem>
    </LandingSection>
  );
};

export default Reviews;
