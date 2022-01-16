import { useState, useCallback, useEffect } from 'react';

import { getAvatar } from '../../../Modules/getAvatar';

import ReviewScore from '../../../common/ReviewScore';

import { Avatar, Flexbox, Header, InlineLink, Text } from '../../../UI-Components';
import { Location } from '../../../icons';
import { ReviewWrapper, TextClamper } from '../styles';

const Review = ({ review, t, prevSlide, index }) => {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [readMoreVisible, setReadMoreVisible] = useState(false);

  useEffect(() => {
    prevSlide === index && setReviewOpen(false)
  }, [prevSlide])

  const reviewBox = useCallback((node) => {
    if (node !== null) {
      const reviewBody = [...node.children].find((child) => child.tagName === 'P');
      reviewBody.scrollHeight > reviewBody.clientHeight && setReadMoreVisible(true);
    }
  }, []);

  return (
    <ReviewWrapper ref={reviewBox}>
      <Avatar src={review.avatar ?? getAvatar(review.username)} size='md' space={2} />
      <Header level={4} space={2}>
        {review.username}
      </Header>
      <Flexbox>
        <Location />
        <Text>{review.location}</Text>
      </Flexbox>
      <ReviewScore score={review.score} />

      <TextClamper open={reviewOpen}>{review.body}</TextClamper>
      {readMoreVisible && (
        <InlineLink onClick={() => setReviewOpen(!reviewOpen)}>
          {reviewOpen ? t('reusable:cta.hide') : t('reusable:cta.read-more')}
        </InlineLink>
      )}
    </ReviewWrapper>
  );
};

export default Review;
