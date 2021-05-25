import React, { useState, useEffect } from 'react';
import withAuth from '../../HOC/withAuth';
import Spinner from '../ReusableComponents/Spinner';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { Header, Segment, Button, Message } from 'semantic-ui-react';

const AllBookings = ({ id, history, username }) => {
  const { t, ready } = useTranslation('AllBookings');

  const [errors, setErrors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const axiosCallErrorHandling = (errorMessage) => {
    setLoading(false);
    setErrors(errorMessage);
  };

  useEffect(() => {
    const lang = detectLanguage();
    if (window.navigator.onLine === false) {
      axiosCallErrorHandling(['reusable:errors:window-navigator']);
    } else {
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
    }
    // eslint-disable-next-line
  }, []);

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
        <p className='small-centered-paragraph' style={{ color: 'white' }}>
          {t('AllBookings:requests')}&nbsp;{outgoingRequests}&thinsp;
          {t('AllBookings:upcoming')}&nbsp;{outgoingUpcoming}&thinsp;
          {t('AllBookings:history')}&nbsp;{outgoingHistory}
        </p>
      );
      outgoingText = <p style={{ textAlign: 'center' }}>{t('AllBookings:outgoing-text')}</p>;
      outgoingCTA = (
        <Header
          className='fake-link'
          style={{ cursor: 'pointer', textAlign: 'center', marginTop: '1rem', textDecoration: 'underline' }}
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
        <p className='small-centered-paragraph' style={{ color: 'white' }}>
          {t('AllBookings:outgoing-booking-stats')}
        </p>
      );
      outgoingText = <p style={{ textAlign: 'center' }}>{t('AllBookings:outgoing-text-2')}</p>;
      outgoingCTA = (
        <Header
          className='fake-link'
          style={{ cursor: 'pointer', textAlign: 'center', marginTop: '1rem', textDecoration: 'underline' }}
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
        <p className='small-centered-paragraph' style={{ color: 'white' }}>
          {t('AllBookings:requests')}&nbsp;{incomingRequests}&thinsp;
          {t('AllBookings:upcoming')}&nbsp;{incomingUpcoming}&thinsp;
          {t('AllBookings:history')}&nbsp;{incomingHistory}
        </p>
      );
      if (incomingRequests !== 0) {
        incomingText = (
          <p style={{ textAlign: 'center' }}>
            <Trans count={parseInt(incomingRequests)} i18nKey='AllBookings:incoming-text'>
              You have
              <strong style={{ color: '#c90c61' }}>{{ count: incomingRequests }} incoming booking request</strong>
              awaiting your decision.
            </Trans>
          </p>
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
        incomingText = <p style={{ textAlign: 'center' }}>{t('AllBookings:incoming-text-2')}</p>;
        incomingCTA = (
          <Header
            className='fake-link'
            style={{ cursor: 'pointer', textAlign: 'center', marginTop: '1rem', textDecoration: 'underline' }}
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
        <p className='small-centered-paragraph' style={{ color: 'white' }}>
          {t('AllBookings:outgoing-booking-stats')}
        </p>
      );
      incomingText = <p style={{ textAlign: 'center' }}>{t('AllBookings:incoming-text-3')}</p>;
      incomingCTA = (
        <Header
          className='fake-link'
          style={{ cursor: 'pointer', textAlign: 'center', marginTop: '1rem', textDecoration: 'underline' }}
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
      <Segment className='box-shadow'>
        <div className='topbox'>
          <Header as='h3' style={{ color: 'white', marginBottom: '0' }}>
            {t('AllBookings:outgoing-segment')}
          </Header>
          {outgoingBookingStats}
        </div>
        {outgoingText}
        {outgoingCTA}
      </Segment>
    );

    incomingSegment = (
      <Segment className='box-shadow'>
        <div className='topbox'>
          <Header as='h3' style={{ color: 'white', marginBottom: '0' }}>
            {t('AllBookings:incoming-segment')}
          </Header>
          {incomingBookingStats}
        </div>
        {incomingText}
        {incomingCTA}
      </Segment>
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
              <Message negative>
                <ul id='message-error-list'>
                  {errors.map((error) => (
                    <li key={error}>{t(error)}</li>
                  ))}
                </ul>
              </Message>
            )}
          </div>
        </Popup>
        <div className='content-wrapper'>
          <Header as='h1'>
            {t('AllBookings:hi')} {username}!
          </Header>
          <p style={{ textAlign: 'center' }}>{t('AllBookings:header-page')}</p>
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
        </div>
      </>
    );
  } else {
    return <Spinner />;
  }
};

const mapStateToProps = (state) => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id,
});

export default connect(mapStateToProps)(withAuth(AllBookings));
