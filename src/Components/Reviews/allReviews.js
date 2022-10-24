import { useEffect, useState, useCallback } from 'react';

import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { getAvatar } from '../../Modules/getAvatar';

import Spinner from '../../common/Spinner';
import ReviewScore from '../../common/ReviewScore';

import { Divider, Notice, Text, Container, Flexbox, Avatar, Header } from '../../UI-Components';
import { ReplyWrapper } from './styles';

import HostReplyReview from './hostReplyReview';

const AllReviews = ({ score, hostProfileId, withReply, username }) => {
  const { t, ready } = useTranslation('AllReviews');

  const allReviews = useCallback((node) => {
    if (node !== null) {
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].id === window.location.hash.substr(1) && window.scrollY === 0) {
          setTimeout(function () {
            window.scrollTo({ top: node.children[i].getBoundingClientRect().top - 90, behavior: 'smooth' });
          }, 500);
        }
      }
    }
  }, []);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [reload, setReload] = useState('');

  const lang = detectLanguage();
  moment.locale(lang);

  useEffect(() => {
    setLoading(true);
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrors(['reusable:errors:window-navigator']);
      return;
    }
    axios
      .get(`/api/v1/reviews?host_profile_id=${hostProfileId}&locale=${lang}`)
      .then((resp) => {
        let sortedReviews = resp.data;
        sortedReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setReviews(sortedReviews);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (error.response.status === 500) {
          setErrors(['reusable:errors.500']);
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors.401'));
          wipeCredentials('/');
        } else {
          setErrors([error.response.data.error]);
        }
      });
  }, [reload]);

  if (!ready || loading) return <Spinner />;

  return (
    <>
      {errors.length > 0 && (
        <Notice nature='danger'>
          <ul>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      )}
      {!score && <Text italic>{t('AllReviews:no-reviews')}</Text>}
      {score && !reviews.length && <Text italic>{t('reusable:errors:index-no-host-2')}</Text>}
      {score && (
        <>
          <ReviewScore score={score} displayNumerical data-cy='average-score' />
          <Text italic space={6} data-cy='review-count'>
            {t('AllReviews:review-count', { count: reviews.length })}
          </Text>
          <Divider botom={5} />
          <div id='all-reviews' ref={allReviews}>
            {reviews.map((review) => (
              <Container key={review.id} data-cy={`review-${review.id}`}>
                <Flexbox horizontalAlign='left' spaceItemsX={1} space={3}>
                  <Avatar
                    data-cy='reviewer-avatar'
                    size='md'
                    src={review.user?.profile_avatar ?? getAvatar(review.user && review.user.nickname)}
                  />
                  <Flexbox spaceItemsX={1} verticalAlign='bottom' horizontalAlign='left' wrap={true}>
                    <Header level={5} data-cy='reviewer-name'>
                      {review.user?.nickname ?? t('reusable:deleted-user')}
                    </Header>
                    <Text size='sm' data-cy='date'>
                      {moment(review.created_at).fromNow()}
                    </Text>
                  </Flexbox>
                </Flexbox>
                <Container space={2}>
                  <ReviewScore
                    data-cy='score'
                    score={review.score}
                    displayNumerical={true}
                    height={4}
                    margin={0}
                    primaryColor='neutral'
                  />
                </Container>
                <Text space={6} data-cy='review-body'>
                  {review.body}
                </Text>
                {review.host_reply && (
                  <ReplyWrapper right={4} data-cy='reply'>
                    <Flexbox horizontalAlign='left' spaceItemsX={1} space={1}>
                      <Avatar
                        size='xs'
                        src={review.host_avatar ?? getAvatar(review.host_nickname)}
                        data-cy='reply-avatar'
                      />
                      <Flexbox spaceItemsX={1} verticalAlign='bottom' horizontalAlign='left' wrap={true}>
                        <Header level={5} data-cy='reply-name'>
                          {review.host_nickname}
                        </Header>
                        <Text size='sm' data-cy='reply-date'>
                          {moment(review.updated_at).fromNow()}
                        </Text>
                      </Flexbox>
                    </Flexbox>
                    <ReplyWrapper right={6}>
                      <Text data-cy='reply-body'>{review.host_reply}</Text>
                    </ReplyWrapper>
                  </ReplyWrapper>
                )}
                {!review.host_reply && review.host_nickname === username && withReply && (
                  <HostReplyReview reviewId={review.id} reload={(reply) => setReload(reply)} />
                )}
                <Divider top={5} />
              </Container>
            ))}
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({ username: state.reduxTokenAuth.currentUser.attributes.username });

export default connect(mapStateToProps)(AllReviews);
