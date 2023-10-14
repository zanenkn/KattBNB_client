import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import moment from 'moment';

import withAuth from '../../../HOC/withAuth';
import Spinner from '../../../common/Spinner';
import useCurrentScope from '../../../hooks/useCurrentScope';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { SecondaryStickyHeader, Header, Button, Text, Notice } from '../../../UI-Components';
import { SectionWrapper, StyledContentWrapper, ScrollToTop } from '../common/styles';
import { CheveronUp } from '../../../icons';
import IncomingRequests from './incomingRequests';
import IncomingUpcoming from './incomingUpcoming';
import IncomingHistory from './incomingHistory';

const IncomingBookings = ({ location: { state } }) => {
  const { t, ready } = useTranslation('IncomingBookings');
  const { locale, headers } = useCurrentScope();

  const [scrollYPosition, setScrollYPosition] = useState(0);
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const today = moment.utc().hours(0).minutes(0).seconds(0).milliseconds(0).valueOf();

  const secondaryHeaderHeight = 150;

  const requestsSection = useRef(null);
  const upcomingSection = useRef(null);
  const historySection = useRef(null);

  const handleScroll = () => {
    setScrollYPosition(window.scrollY);
  };

  const axiosCallStateHandling = (loadingState, errorMessage) => {
    setLoading(loadingState);
    setErrors(errorMessage);
  };

  const scrollToSection = (section) => {
    window.scrollTo({ top: section.current.offsetTop - secondaryHeaderHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    if (window.navigator.onLine === false) {
      axiosCallStateHandling(false, ['reusable:errors:window-navigator']);
    } else if (window.history.state === null) {
      window.location.replace('/all-bookings');
    } else {
      const inBookings = `/api/v1/bookings?stats=no&host_nickname=${state.hostNickname}&locale=${locale}`;
      axios
        .get(inBookings, { headers: headers })
        .then(({ data }) => {
          setIncomingBookings(data);
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

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  if (!ready || loading) return <Spinner page />;

  return (
    <>
      <SecondaryStickyHeader height={secondaryHeaderHeight}>
        <Header level={3} centered space={2}>
          {t('IncomingBookings:main-header')}
        </Header>
        <Text centered>{t('IncomingBookings:main-desc')}</Text>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => {
              scrollToSection(requestsSection);
            }}
          >
            {t('IncomingBookings:requests')}
          </Button>
          <Button
            onClick={() => {
              scrollToSection(upcomingSection);
            }}
          >
            {t('IncomingBookings:upcoming')}
          </Button>
          <Button
            onClick={() => {
              scrollToSection(historySection);
            }}
          >
            {t('IncomingBookings:history')}
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
            {t('IncomingBookings:requests')}
          </Header>
          <IncomingRequests
            requests={incomingBookings
              .filter((booking) => booking.status === 'pending')
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())}
          />
        </SectionWrapper>
        <SectionWrapper ref={upcomingSection}>
          <Header level={2} centered space={2}>
            {t('IncomingBookings:upcoming')}
          </Header>
          <IncomingUpcoming
            bookings={incomingBookings
              .filter((booking) => booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today)
              .sort((a, b) => new Date(a.dates[0]).getTime() - new Date(b.dates[0]).getTime())}
          />
        </SectionWrapper>
        <SectionWrapper ref={historySection}>
          <Header level={2} centered space={2}>
            {t('IncomingBookings:history')}
          </Header>
          <IncomingHistory
            bookings={incomingBookings
              .filter(
                (booking) =>
                  booking.dates[booking.dates.length - 1] < today ||
                  (booking.status !== 'accepted' && booking.status !== 'pending')
              )
              .sort((a, b) => new Date(b.dates[0]).getTime() - new Date(a.dates[0]).getTime())}
          />
        </SectionWrapper>
        <ScrollToTop onClick={scrollToTop} show={scrollYPosition > 200}>
          <CheveronUp height={10} />
        </ScrollToTop>
      </StyledContentWrapper>
    </>
  );
};

export default withAuth(IncomingBookings);
