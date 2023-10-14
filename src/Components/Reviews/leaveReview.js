import { useState, useEffect } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';

import withAuth from '../../HOC/withAuth';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import useCurrentScope from '../../hooks/useCurrentScope';

import Spinner from '../../common/Spinner';
import ReviewScore from '../../common/ReviewScore';
import BookingInfo from '../../common/BookingInfo';

import { ContentWrapper, Header, Whitebox, Text, TextArea, Notice, Button, Container } from '../../UI-Components';

const LeaveReview = ({ history, location }) => {
  const { t, ready } = useTranslation('LeaveReview');
  const { locale } = useCurrentScope();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [reviewBody, setReviewBody] = useState('');
  const [reviewScore, setReviewScore] = useState(0);
  const [hostNickname, setHostNickname] = useState(null);
  const [userId, setUserId] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [bookingStart, setBookingStart] = useState(null);
  const [bookingEnd, setBookingEnd] = useState(null);
  const [hostLocation, setHostLocation] = useState(null);
  const [cats, setCats] = useState(null);

  useEffect(() => {
    window.onpopstate = () => {
      history.push('/all-bookings');
    };
    if (location.state) {
      setHostNickname(location.state.hostNickname);
      setUserId(location.state.userId);
      setBookingId(location.state.bookingId);
      setProfileId(location.state.hostProfileId);
      setBookingStart(location.state.startDate);
      setBookingEnd(location.state.endDate);
      setHostLocation(location.state.hostLocation);
      setCats(location.state.cats);
    } else {
      setHostNickname(queryString.parse(location.search).hostNickname);
      setUserId(queryString.parse(location.search).userId);
      setBookingId(queryString.parse(location.search).bookingId);
      setProfileId(queryString.parse(location.search).hostProfileId);
      setBookingStart(queryString.parse(location.search).startDate);
      setBookingEnd(queryString.parse(location.search).endDate);
      setHostLocation(queryString.parse(location.search).hostLocation);
      setCats(queryString.parse(location.search).cats);
    }
    // eslint-disable-next-line
  }, []);

  const createReview = () => {
    setLoading(true);
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (reviewScore < 1) {
        setLoading(false);
        setErrors(['LeaveReview:error-no-score']);
      } else if (reviewBody === '') {
        setLoading(false);
        setErrors(['LeaveReview:error-empty']);
      } else if (reviewBody.length > 1000) {
        setLoading(false);
        setErrors(['LeaveReview:error-length']);
      } else {
        const path = '/api/v1/reviews';
        const payload = {
          score: reviewScore,
          body: reviewBody,
          host_nickname: hostNickname,
          user_id: userId,
          booking_id: bookingId,
          host_profile_id: profileId,
          locale: locale,
        };
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        axios
          .post(path, payload, { headers: headers })
          .then(() => {
            history.push('/successful-review');
          })
          .catch(({ response }) => {
            setLoading(false);
            if (response === undefined || response.status === 500) {
              setErrors(['reusable:errors.unknown']);
            }
            if (response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/login');
            }
            setErrors(response.data.errors);
          });
      }
    }
  };

  if (!ready) return <Spinner />;

  return (
    <ContentWrapper>
      <Header level={2} centered>
        {t('LeaveReview:title')}
      </Header>
      <Text centered space={7}>
        {t('LeaveReview:desc')}
      </Text>
      <Whitebox>
        <BookingInfo start={bookingStart} end={bookingEnd} place={hostLocation} cats={cats} space={5} />
        <Container>
          <ReviewScore
            displayNumerical
            setScore={(e) => setReviewScore(parseInt(e.currentTarget.id))}
            score={reviewScore}
            clickable
            primaryColor={'primary'}
            secondaryColor={'neutral'}
            required
          />
        </Container>
        <TextArea
          label={t('LeaveReview:label')}
          required
          value={reviewBody}
          onChange={(e) => setReviewBody(e.target.value)}
          space={1}
        />
        <Text right size={'sm'} italic>
          {t('reusable:remaining-chars')} {1000 - reviewBody.length}
        </Text>
        {errors.length > 0 && (
          <Notice nature='danger'>
            <ul>
              {errors.map((error) => (
                <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
              ))}
            </ul>
          </Notice>
        )}
        <Button onClick={() => createReview()} loading={loading} disabled={loading}>
          {t('LeaveReview:cta')}
        </Button>
      </Whitebox>
    </ContentWrapper>
  );
};

export default withAuth(LeaveReview);
