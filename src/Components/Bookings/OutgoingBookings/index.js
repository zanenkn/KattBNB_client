import React, { useState, useEffect, useRef } from 'react';
import withAuth from '../../../HOC/withAuth';
import Spinner from '../../../common/Spinner';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import OutgoingRequests from './outgoingRequests';
import OutgoingUpcoming from './outgoingUpcoming';
import OutgoingHistory from './outgoingHistory';
import { SecondaryStickyHeader, Header, Button, Text, Notice } from '../../../UI-Components';
import { ScrollToTop, SectionWrapper, StyledContentWrapper } from '../common/styles';
import { CheveronUp } from '../../../icons';

const OutgoingBookings = ({ location: { state } }) => {
  const { t, ready } = useTranslation('OutgoingBookings');

  const [scrollYPosition, setScrollYPosition] = useState(0);
  const [outgoingBookings, setOutgoingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const requestsSection = useRef(null);
  const upcomingSection = useRef(null);
  const historySection = useRef(null);

  const secondaryHeaderHeight = 150;
  const today = moment.utc().hours(0).minutes(0).seconds(0).milliseconds(0).valueOf();

  const handleScroll = () => {
    setScrollYPosition(window.scrollY);
  };

  const axiosCallStateHandling = (loadingState, errorMessage) => {
    setLoading(loadingState);
    setErrors(errorMessage);
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (section) => {
    window.scrollTo({ top: section.current.offsetTop - secondaryHeaderHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    const lang = detectLanguage();
    if (window.navigator.onLine === false) {
      axiosCallStateHandling(false, ['reusable:errors:window-navigator']);
    } else if (window.history.state === null) {
      window.location.replace('/all-bookings');
    } else {
      const outBookings = `/api/v1/bookings?stats=no&user_id=${state.userId}&locale=${lang}`;
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      axios
        .get(outBookings, { headers: headers })
        .then(({ data }) => {
          setOutgoingBookings(data);
          axiosCallStateHandling(false, []);
        })
        .catch(({ response }) => {
          if (response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 500) {
            axiosCallStateHandling(false, ['reusable:errors:500']);
          } else if (response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/');
          } else {
            axiosCallStateHandling(false, [response.data.error]);
          }
        });
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line
  }, []);

  if (!ready || loading) return <Spinner />;

  return (
    <>
      <SecondaryStickyHeader height={secondaryHeaderHeight}>
        <Header level={3} centered space={2}>
          {t('OutgoingBookings:main-header')}
        </Header>
        <Text centered>{t('OutgoingBookings:desc')}</Text>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => {
              scrollToSection(requestsSection);
            }}
          >
            {t('OutgoingBookings:requests')}
          </Button>
          <Button
            onClick={() => {
              scrollToSection(upcomingSection);
            }}
          >
            {t('OutgoingBookings:upcoming')}
          </Button>
          <Button
            onClick={() => {
              scrollToSection(historySection);
            }}
          >
            {t('OutgoingBookings:history')}
          </Button>
        </div>
      </SecondaryStickyHeader>
      <StyledContentWrapper padding={secondaryHeaderHeight}>
        {errors.length > 0 && (
          <Notice nature='danger'>
            <ul id='message-error-list'>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Notice>
        )}
        <SectionWrapper ref={requestsSection}>
          <Header level={2} centered space={2}>
            {t('OutgoingBookings:requests')}
          </Header>
          <OutgoingRequests
            bookings={outgoingBookings
              .filter((booking) => booking.status === 'pending')
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
          />
        </SectionWrapper>
        <SectionWrapper ref={upcomingSection}>
          <Header level={2} centered space={2}>
            {t('OutgoingBookings:upcoming')}
          </Header>
          <OutgoingUpcoming
            bookings={outgoingBookings
              .filter((booking) => booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
          />
        </SectionWrapper>
        <SectionWrapper ref={historySection}>
          <Header level={2} centered space={2}>
            {t('OutgoingBookings:history')}
          </Header>
          <OutgoingHistory
            bookings={outgoingBookings
              .filter((booking) => booking.dates[booking.dates.length - 1] < today)
              .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())}
          />
        </SectionWrapper>
        <ScrollToTop onClick={scrollToTop} show={scrollYPosition > 200}>
          <CheveronUp height={10} />
        </ScrollToTop>
      </StyledContentWrapper>
    </>
  );
};

export default withAuth(OutgoingBookings);
