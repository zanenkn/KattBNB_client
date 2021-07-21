import React, { useState, useEffect } from 'react';
import withAuth from '../../../HOC/withAuth';
import Spinner from '../../ReusableComponents/Spinner';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { BoxShadow, TopBox } from './styles';
import { Header, ContentWrapper, Text, Button, Notice } from '../../../UI-Components';
// Almost migrated, Text color and other styling

const AllBookings = ({ id, history, username }) => {
  const { t, ready } = useTranslation('AllBookings');

  const [errors, setErrors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const lang = detectLanguage();

  const axiosCallErrorHandling = (errorMessage) => {
    setLoading(false);
    setErrors(errorMessage);
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

    // eslint-disable-next-line
  }, []);

  if (!ready || loading) {
    return <Spinner />;
  }

  if (ready && loading === false) {
    let outgoingRequests = parseInt(stats.out_requests);
    let outgoingUpcoming = parseInt(stats.out_upcoming);
    let outgoingHistory = parseInt(stats.out_history);
    let incomingRequests = parseInt(stats.in_requests);
    let incomingUpcoming = parseInt(stats.in_upcoming);
    let incomingHistory = parseInt(stats.in_history);
    let incomingBookingStats,
      incomingSegment,
      incomingText,
      incomingCTA,
      outgoingBookingStats,
      outgoingSegment,
      outgoingText,
      outgoingCTA;

    if (outgoingRequests !== 0 || outgoingUpcoming !== 0 || outgoingHistory !== 0) {
      outgoingBookingStats = (
        // white text?
        <Text size='sm' centered>
          {t('AllBookings:requests')}&nbsp;{outgoingRequests}&thinsp;
          {t('AllBookings:upcoming')}&nbsp;{outgoingUpcoming}&thinsp;
          {t('AllBookings:history')}&nbsp;{outgoingHistory}
        </Text>
      );
      outgoingText = <Text centered>{t('AllBookings:outgoing-text')}</Text>;
      outgoingCTA = (
        <Header
          centered
          style={{ cursor: 'pointer', marginTop: '1rem', textDecoration: 'underline' }}
          id='view-outgoing-bookings'
          onClick={() => {
            history.push({
              pathname: '/outgoing-bookings',
              state: { userId: id },
            });
          }}
        >
          {t('AllBookings:view')}
        </Header>
      );
    } else {
      outgoingBookingStats = (
        // white text?
        <Text centered size='sm'>
          {t('AllBookings:outgoing-booking-stats')}
        </Text>
      );
      outgoingText = <Text centered>{t('AllBookings:outgoing-text-2')}</Text>;
      outgoingCTA = (
        <Header
          centered
          style={{ cursor: 'pointer', marginTop: '1rem', textDecoration: 'underline' }}
          id='view-outgoing-bookings'
          onClick={() => {
            history.push('/search');
          }}
        >
          {t('AllBookings:outgoing-cta')}
        </Header>
      );
    }

    if (incomingRequests !== 0 || incomingUpcoming !== 0 || incomingHistory !== 0) {
      incomingBookingStats = (
        // white text?
        <Text size='sm' centered>
          {t('AllBookings:requests')}&nbsp;{incomingRequests}&thinsp;
          {t('AllBookings:upcoming')}&nbsp;{incomingUpcoming}&thinsp;
          {t('AllBookings:history')}&nbsp;{incomingHistory}
        </Text>
      );
      if (incomingRequests !== 0) {
        incomingText = (
          <Text centered>
            <Trans count={parseInt(incomingRequests)} i18nKey='AllBookings:incoming-text'>
              You have
              <strong style={{ color: '#c90c61' }}>{{ count: incomingRequests }} incoming booking request</strong>
              awaiting your decision.
            </Trans>
          </Text>
        );
        incomingCTA = (
          <Button
            id='view-incoming-bookings'
            onClick={() => {
              history.push({
                pathname: '/incoming-bookings',
                state: { hostNickname: username },
              });
            }}
          >
            {t('AllBookings:view')}
          </Button>
        );
      } else {
        incomingText = <Text centered>{t('AllBookings:incoming-text-2')}</Text>;
        incomingCTA = (
          <Header
            centered
            style={{ cursor: 'pointer', marginTop: '1rem', textDecoration: 'underline' }}
            id='view-incoming-bookings'
            onClick={() => {
              history.push({
                pathname: '/incoming-bookings',
                state: { hostNickname: username },
              });
            }}
          >
            {t('AllBookings:view')}
          </Header>
        );
      }
    } else {
      incomingBookingStats = (
        // White text ???
        <Text centered size='sm'>
          {t('AllBookings:outgoing-booking-stats')}
        </Text>
      );
      incomingText = <Text centered>{t('AllBookings:incoming-text-3')}</Text>;
      incomingCTA = (
        <Header
          centered
          style={{ cursor: 'pointer', marginTop: '1rem', textDecoration: 'underline' }}
          id='view-incoming-bookings'
          onClick={() => {
            history.push('/faq?section=sitter&active=201');
          }}
        >
          {t('AllBookings:incoming-cta')}
        </Header>
      );
    }

    outgoingSegment = (
      <BoxShadow>
        <TopBox>
          {/* white text ??? */}
          <Header level={3}>{t('AllBookings:outgoing-segment')}</Header>
          {outgoingBookingStats}
        </TopBox>
        {outgoingText}
        {outgoingCTA}
      </BoxShadow>
    );

    incomingSegment = (
      <BoxShadow>
        <TopBox>
          {/* white text ??? */}
          <Header level={3}>{t('AllBookings:incoming-segment')}</Header>
          {incomingBookingStats}
        </TopBox>
        {incomingText}
        {incomingCTA}
      </BoxShadow>
    );

    return (
      <>
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
        <ContentWrapper>
          <Header>
            {t('AllBookings:hi')} {username}!
          </Header>
          <Text centered>{t('AllBookings:header-page')}</Text>
          {incomingRequests !== 0 || incomingUpcoming !== 0 || incomingHistory !== 0 ? (
            <>
              {incomingSegment}
              {outgoingSegment}
            </>
          ) : (
            <>
              {outgoingSegment}
              {incomingSegment}
            </>
          )}
        </ContentWrapper>
      </>
    );
  }
};

const mapStateToProps = (state) => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id,
});

export default connect(mapStateToProps)(withAuth(AllBookings));
