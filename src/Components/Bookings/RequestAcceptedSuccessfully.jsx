import React, { useEffect } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import moment from 'moment';
import Spinner from '../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ICalendarLink from 'react-icalendar-link';

const RequestAcceptedSuccessfully = ({ history, location: { state } }) => {
  const { t, ready } = useTranslation('RequestAcceptedSuccessfully');

  useEffect(() => {
    if (history.action === 'POP') {
      history.push({ pathname: '/all-bookings' });
    }
    // eslint-disable-next-line
  }, []);

  if (ready) {
    const { cats, inDate, outDate, price, user } = state;

    let total;
    let priceWithDecimalsString = price.toFixed(2);
    if (
      priceWithDecimalsString[priceWithDecimalsString.length - 1] === '0' &&
      priceWithDecimalsString[priceWithDecimalsString.length - 2] === '0'
    ) {
      total = parseFloat(priceWithDecimalsString);
    } else {
      total = priceWithDecimalsString;
    }

    let googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${moment(inDate).format(
      'YYYYMMDD'
    )}T000000Z/${moment(outDate).format('YYYYMMDD')}T200000Z&location=${t(
      'RequestAcceptedSuccessfully:event-location'
    )}&text=${t('RequestAcceptedSuccessfully:event-title', {
      total: total,
    })}&details=${t('RequestAcceptedSuccessfully:event-info', {
      nickname: user,
      count: cats,
    })}`;

    let calendarEvent = {
      title: t('RequestAcceptedSuccessfully:event-title', { total: total }),
      description: t('RequestAcceptedSuccessfully:event-info', {
        nickname: user,
        count: cats,
      }),
      location: t('RequestAcceptedSuccessfully:event-location'),
      startTime: inDate,
      endTime: outDate,
    };

    return (
      <div className='content-wrapper'>
        <Header as='h1'>{t('RequestAcceptedSuccessfully:title')}</Header>
        <Segment className='whitebox' style={{ textAlign: 'center' }}>
          <p>
            <Trans i18nKey='RequestAcceptedSuccessfully:desc'>
              You have successfully accepted a booking request. The person who requested this booking has been notified
              about your decision and has received an access to your full address. You can message them using your
              Incoming Bookings dashboard. Questions? Check out our
              <Header as={Link} to='faq' className='fake-link'>
                FAQ
              </Header>
              .
            </Trans>
          </p>
          <span style={{ display: 'grid' }}>
            <a style={{ marginTop: '10px', marginBottom: '15px' }} href={googleLink} target='_blank' rel='noreferrer'>
              {t('RequestAcceptedSuccessfully:add-google-calendar')}
            </a>
            <ICalendarLink event={calendarEvent}>
              {t('RequestAcceptedSuccessfully:download-calendar-event')}
            </ICalendarLink>
          </span>
        </Segment>
      </div>
    );
  } else {
    return <Spinner />;
  }
};

export default RequestAcceptedSuccessfully;
