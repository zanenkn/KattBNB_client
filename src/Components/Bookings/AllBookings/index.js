import React, { useState, useEffect } from 'react';
import withAuth from '../../../HOC/withAuth';
import Spinner from '../../../common/Spinner';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { ReversibleWrapper } from './styles';
import { Header, Text, Notice, Container, Accent, ContentWrapper } from '../../../UI-Components';
import BookingSegment from './bookingSegment';
// Completely MIGRATED

const AllBookings = ({ id, history, username, dispatch }) => {
  const { t, ready } = useTranslation('AllBookings');

  const [errors, setErrors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const lang = detectLanguage();

  let outgoingRequests = parseInt(stats.out_requests);
  let outgoingUpcoming = parseInt(stats.out_upcoming);
  let outgoingHistory = parseInt(stats.out_history);
  let incomingRequests = parseInt(stats.in_requests);
  let incomingUpcoming = parseInt(stats.in_upcoming);
  let incomingHistory = parseInt(stats.in_history);

  const userHasIncomingBookings = incomingRequests !== 0 || incomingUpcoming !== 0 || incomingHistory !== 0;
  const userHasOutgoingBookings = outgoingRequests !== 0 || outgoingUpcoming !== 0 || outgoingHistory !== 0;
  const hasIncomingRequest = incomingRequests !== 0;

  const getBookingStats = (requests, upcoming, history) => {
    return `${t('AllBookings:requests')}&nbsp;${requests}
    &thinsp;${t('AllBookings:upcoming')}&nbsp;${upcoming}
    &thinsp;${t('AllBookings:history')}&nbsp;${history}`;
  };

  const axiosCallErrorHandling = (errorMessage) => {
    setLoading(false);
    setErrors(errorMessage);
  };

  const getHostProfile = () => {
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };

    const lang = detectLanguage();
    axios.get(`/api/v1/host_profiles?user_id=${id}&locale=${lang}`).then((res) => {
      axios.get(`/api/v1/host_profiles/${res.data[0].id}?locale=${lang}`, { headers: headers }).then((response) => {
        dispatch({ type: 'HOST_PROFILE_FETCHED', hostProfile: response.data });
      });
    });
  };

  useEffect(() => {
    if (window.navigator.onLine === false) {
      return axiosCallErrorHandling(['reusable:errors:window-navigator']);
    }

    const bookings = `/api/v1/bookings?stats=yes&user_id=${id}&host_nickname=${username}&locale=${lang}`;
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };

    axios
      .get(bookings, { headers: headers })
      .then(({ data }) => {
        setStats(data.stats);
        setLoading(false);
        setErrors([]);
      })
      .catch(({ response }) => {
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 500) {
          axiosCallErrorHandling(['reusable:errors:500']);
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          axiosCallErrorHandling([response.data.error]);
        }
      });

    getHostProfile();

    // eslint-disable-next-line
  }, []);

  if (!ready || loading) {
    return <Spinner />;
  }

  return (
    <ContentWrapper>
      <Popup
        modal
        open={errors.length > 0}
        closeOnDocumentClick={true}
        onClose={() => setErrors([])}
        position='top center'
      >
        <div>
          {errors.length > 0 && (
            <Notice nature='danger'>
              <ul id='message-error-list'>
                {errors.map((error) => (
                  <li key={error}>{t(error)}</li>
                ))}
              </ul>
            </Notice>
          )}
        </div>
      </Popup>
      <Container space={6}>
        <Header centered space={2} level={2}>
          {t('AllBookings:hi')} {username}!
        </Header>
        <Text centered>{t('AllBookings:header-page')}</Text>
      </Container>

      <ReversibleWrapper revert={userHasIncomingBookings}>
        <BookingSegment
          id='outgoing-bookings'
          header={t('AllBookings:outgoing-segment')}
          stats={
            userHasOutgoingBookings
              ? getBookingStats(outgoingRequests, outgoingUpcoming, outgoingHistory)
              : t('AllBookings:outgoing-booking-stats')
          }
          text={userHasOutgoingBookings ? t('AllBookings:outgoing-text') : t('AllBookings:outgoing-text-2')}
          cta={userHasOutgoingBookings ? t('AllBookings:view') : t('AllBookings:outgoing-cta')}
          ctaAction={() =>
            userHasOutgoingBookings
              ? history.push({
                  pathname: '/outgoing-bookings',
                  state: { userId: id },
                })
              : history.push('/search')
          }
        />
        <BookingSegment
          id='incoming-bookings'
          header={t('AllBookings:incoming-segment')}
          stats={
            userHasIncomingBookings
              ? getBookingStats(incomingRequests, incomingUpcoming, incomingHistory)
              : t('AllBookings:outgoing-booking-stats')
          }
          text={
            hasIncomingRequest ? (
              <Trans count={parseInt(incomingRequests)} i18nKey='AllBookings:incoming-text'>
                You have
                <Accent color='primary'>{{ count: incomingRequests }} incoming booking request</Accent>
                awaiting your decision.
              </Trans>
            ) : userHasIncomingBookings ? (
              t('AllBookings:incoming-text-2')
            ) : (
              t('AllBookings:incoming-text-3')
            )
          }
          cta={userHasIncomingBookings ? t('AllBookings:view') : t('AllBookings:incoming-cta')}
          ctaAction={() =>
            userHasIncomingBookings
              ? history.push({
                  pathname: '/incoming-bookings',
                  state: { hostNickname: username },
                })
              : history.push('/faq?active=201')
          }
          ctaIsButton={hasIncomingRequest}
        />
      </ReversibleWrapper>
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id,
  hostProfile: state.hostProfile.data,
});

export default connect(mapStateToProps)(withAuth(AllBookings));
