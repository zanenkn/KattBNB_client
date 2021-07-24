import React, { useState, useEffect } from 'react';
import withAuth from '../../../HOC/withAuth';
import Spinner from '../../ReusableComponents/Spinner';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import OutgoingRequests from './outgoingRequests';
import OutgoingUpcoming from './outgoingUpcoming';
import OutgoingHistory from './outgoingHistory';

import { SecondaryStickyHeader } from '../../../UI-Components';
import { StyledContentWrapper } from './styles';

const OutgoingBookings = ({ location: { state } }) => {
  const { t, ready } = useTranslation('OutgoingBookings');

  const [scrollYPosition, setScrollYPosition] = useState(0);
  const [outgoingBookings, setOutgoingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const handleScroll = () => {
    setScrollYPosition(window.scrollY);
  };

  const axiosCallStateHandling = (loadingState, errorMessage) => {
    setLoading(loadingState);
    setErrors(errorMessage);
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

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  let today = moment.utc().hours(0).minutes(0).seconds(0).milliseconds(0).valueOf();
  let requestsSection, upcomingSection, historySection;
  let outgoingRequests = [];
  let outgoingUpcoming = [];
  let outgoingHistory = [];
  outgoingBookings.map((booking) => {
    if (booking.status === 'pending') {
      outgoingRequests.push(booking);
    } else if (booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today) {
      outgoingUpcoming.push(booking);
    } else {
      outgoingHistory.push(booking);
    }
    return null;
  });

  if (!ready || loading) return <Spinner />;

  return (
    <>
      <SecondaryStickyHeader>something</SecondaryStickyHeader>
      <StyledContentWrapper padding={150}>aaaa</StyledContentWrapper>
    </>
  );

  //     <>
  //       <div id='secondary-sticky' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
  //         <Header as='h1' style={{ marginBottom: '0', margin: '0 auto' }}>
  //           {t('OutgoingBookings:main-header')}
  //         </Header>
  //         <p style={{ textAlign: 'center', margin: '0 auto 1rem' }}>{t('OutgoingBookings:desc')}</p>
  //         <div style={{ display: 'flex', justifyContent: 'center' }}>
  //           <Button.Group size='mini'>
  //             <Button
  //               style={{ marginTop: '0' }}
  //               onClick={() => {
  //                 requestsSection.scrollIntoView({ behavior: 'smooth' });
  //               }}
  //             >
  //               {t('OutgoingBookings:requests')}
  //             </Button>
  //             <Button
  //               style={{ marginTop: '0' }}
  //               onClick={() => {
  //                 upcomingSection.scrollIntoView({ behavior: 'smooth' });
  //               }}
  //             >
  //               {t('OutgoingBookings:upcoming')}
  //             </Button>
  //             <Button
  //               style={{ marginTop: '0' }}
  //               onClick={() => {
  //                 historySection.scrollIntoView({ behavior: 'smooth' });
  //               }}
  //             >
  //               {t('OutgoingBookings:history')}
  //             </Button>
  //           </Button.Group>
  //         </div>
  //       </div>
  //       <Container style={{ paddingTop: '150px' }}>
  //         <div className='expanding-wrapper'>
  //           {errors.length > 0 && (
  //             <Message negative>
  //               <ul id='message-error-list'>
  //                 {errors.map((error) => (
  //                   <li key={error}>{t(error)}</li>
  //                 ))}
  //               </ul>
  //             </Message>
  //           )}
  //           <div
  //             ref={(el) => {
  //               requestsSection = el;
  //             }}
  //             className='booking-type-wrapper'
  //           >
  //             <Header as='h2' style={{ marginBottom: '0', marginTop: '2rem' }}>
  //               {t('OutgoingBookings:requests')}
  //             </Header>
  //             <OutgoingRequests requests={outgoingRequests} />
  //           </div>
  //           <div
  //             ref={(el) => {
  //               upcomingSection = el;
  //             }}
  //             className='booking-type-wrapper'
  //           >
  //             <Header as='h2' style={{ marginBottom: '0', marginTop: '3rem' }}>
  //               {t('OutgoingBookings:upcoming')}
  //             </Header>
  //             <OutgoingUpcoming upcoming={outgoingUpcoming} />
  //           </div>
  //           <div
  //             ref={(el) => {
  //               historySection = el;
  //             }}
  //             className='booking-type-wrapper'
  //           >
  //             <Header as='h2' style={{ marginBottom: '0', marginTop: '3rem' }}>
  //               {t('OutgoingBookings:history')}
  //             </Header>
  //             <OutgoingHistory outHistoryBookings={outgoingHistory} />
  //           </div>
  //           <div className='scroll-to-top '>
  //             <Icon
  //               link='#'
  //               name='angle up'
  //               size='huge'
  //               color='grey'
  //               style={scrollYPosition < 200 ? { display: 'none' } : { display: 'block' }}
  //               onClick={scrollToTop}
  //             />
  //           </div>
  //         </div>
  //       </Container>
  //     </>
};

export default withAuth(OutgoingBookings);
