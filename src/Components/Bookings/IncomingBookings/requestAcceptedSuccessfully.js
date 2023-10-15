import React, { useEffect } from 'react';
import moment from 'moment';
import Spinner from '../../../common/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ICalendarLink from 'react-icalendar-link';
import { Whitebox, ContentWrapper, Header, Text, InlineLink, Flexbox } from '../../../UI-Components';
import styled from 'styled-components';

const StyledFlexbox = styled(Flexbox)`
  justify-content: space-between;
  > a {
    color: #90acc7;
    font-weight: 700;
  }
  > a:hover {
    color: #5c85ad;
    text-decoration: underline;
  }
`;

const RequestAcceptedSuccessfully = ({ history, location: { state } }) => {
  useEffect(() => {
    if (history.action === 'POP') {
      history.push({ pathname: '/all-bookings' });
    }
    // eslint-disable-next-line
  }, []);

  const { t, ready } = useTranslation('RequestAcceptedSuccessfully');
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

  if (!ready) {
    return <Spinner page />;
  }

  return (
    <ContentWrapper>
      <Header centered color='primary'>
        {t('RequestAcceptedSuccessfully:title')}
      </Header>
      <Whitebox>
        <Text centered>
          <Trans i18nKey='RequestAcceptedSuccessfully:desc'>
            You have successfully accepted a booking request. The person who requested this booking has been notified
            about your decision and has received an access to your full address. You can message them using your
            Incoming Bookings dashboard. Questions? Check out our
            <InlineLink as={Link} to='/faq' color='info'>
              FAQ
            </InlineLink>
            .
          </Trans>
        </Text>
        <StyledFlexbox>
          <InlineLink color='primary' href={googleLink} target='_blank' rel='noreferrer'>
            {t('RequestAcceptedSuccessfully:add-google-calendar')}
          </InlineLink>
          <ICalendarLink event={calendarEvent}>
            {t('RequestAcceptedSuccessfully:download-calendar-event')}
          </ICalendarLink>
        </StyledFlexbox>
      </Whitebox>
    </ContentWrapper>
  );
};

export default RequestAcceptedSuccessfully;
