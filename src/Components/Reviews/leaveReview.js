import { useState, useEffect } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';

import withAuth from '../../HOC/withAuth';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';

import Spinner from '../../common/Spinner';
import ReviewScore from '../../common/ReviewScore';
import BookingInfo from '../../common/BookingInfo';

import { ContentWrapper, Header, Whitebox, Text, TextArea, Notice, Button, Container } from '../../UI-Components';

const LeaveReview = (props) => {
  const { t, ready } = useTranslation('LeaveReview');

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
      props.history.push('/all-bookings');
    };
    if (props.location.state) {
      setHostNickname(props.location.state.hostNickname);
      setUserId(props.location.state.userId);
      setBookingId(props.location.state.bookingId);
      setProfileId(props.location.state.hostProfileId);
      setBookingStart(props.location.state.startDate);
      setBookingEnd(props.location.state.endDate);
      setHostLocation(props.location.state.hostLocation);
      setCats(props.location.state.cats);
    } else {
      setHostNickname(queryString.parse(props.location.search).hostNickname);
      setUserId(queryString.parse(props.location.search).userId);
      setBookingId(queryString.parse(props.location.search).bookingId);
      setProfileId(queryString.parse(props.location.search).hostProfileId);
      setBookingStart(queryString.parse(props.location.search).startDate);
      setBookingEnd(queryString.parse(props.location.search).endDate);
      setHostLocation(queryString.parse(props.location.search).hostLocation);
      setCats(queryString.parse(props.location.search).cats);
    }
    // eslint-disable-next-line
  }, []);

  const createReview = () => {
    const lang = detectLanguage();
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
          locale: lang,
        };
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        axios
          .post(path, payload, { headers: headers })
          .then(() => {
            props.history.push('/successful-review');
          })
          .catch((error) => {
            if (error.response === undefined) {
              setErrors(['reusable:errors.unknown']);
            } else if (error.response.status === 500) {
              setLoading(false);
              setErrors(['reusable:errors:500']);
            } else if (error.response.status === 422) {
              window.alert(t('LeaveReview:error-no-host'));
              props.history.push('/all-bookings');
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else {
              setLoading(false);
              setErrors([error.response.data.error]);
            }
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
