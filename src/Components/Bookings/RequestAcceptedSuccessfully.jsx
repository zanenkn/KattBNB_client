import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import Spinner from '../ReusableComponents/Spinner';
import { Trans, withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ICalendarLink from 'react-icalendar-link';

class RequestAcceptedSuccessfully extends Component {
  componentDidMount() {
    if (this.props.history.action === 'POP') {
      this.props.history.push({ pathname: '/all-bookings' });
    }
  }

  render() {
    const { t } = this.props;

    let total;

    let priceWithDecimalsString = this.props.location.state.price.toFixed(2);
    if (
      priceWithDecimalsString[priceWithDecimalsString.length - 1] === '0' &&
      priceWithDecimalsString[priceWithDecimalsString.length - 2] === '0'
    ) {
      total = parseFloat(priceWithDecimalsString);
    } else {
      total = priceWithDecimalsString;
    }

    let startDate =
      this.props.location.state.inDate.getFullYear().toString() +
      (this.props.location.state.inDate.getMonth() + 1).toString().padStart(2, '0') +
      this.props.location.state.inDate.getDate().toString().padStart(2, '0');
    let endDate =
      this.props.location.state.outDate.getFullYear().toString() +
      (this.props.location.state.outDate.getMonth() + 1).toString().padStart(2, '0') +
      this.props.location.state.outDate.getDate().toString().padStart(2, '0');

    let googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startDate}T000000Z/${endDate}T200000Z&location=${t(
      'RequestAcceptedSuccessfully:event-location'
    )}&text=${t('RequestAcceptedSuccessfully:event-title', {
      total: total,
    })}&details=${t('RequestAcceptedSuccessfully:event-info', {
      nickname: this.props.location.state.user,
      count: this.props.location.state.cats,
    })}`;

    let calendarEvent = {
      title: t('RequestAcceptedSuccessfully:event-title', { total: total }),
      description: t('RequestAcceptedSuccessfully:event-info', {
        nickname: this.props.location.state.user,
        count: this.props.location.state.cats,
      }),
      location: t('RequestAcceptedSuccessfully:event-location'),
      startTime: this.props.location.state.inDate,
      endTime: this.props.location.state.outDate,
    };

    if (this.props.tReady) {
      return (
        <div className='content-wrapper'>
          <Header as='h1'>{t('RequestAcceptedSuccessfully:title')}</Header>
          <Segment className='whitebox' style={{ textAlign: 'center' }}>
            <p>
              <Trans i18nKey='RequestAcceptedSuccessfully:desc'>
                You have successfully accepted a booking request. The person who requested this booking has been
                notified about your decision and has received an access to your full address. You can message them using
                your Incoming Bookings dashboard. Questions? Check out our
                <Header as={Link} to='faq' className='fake-link'>
                  FAQ
                </Header>
                .
              </Trans>
            </p>
            <span style={{ display: 'grid' }}>
              <a href={googleLink} target='_blank' rel='noreferrer'>
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
  }
}

export default withTranslation('RequestAcceptedSuccessfully')(RequestAcceptedSuccessfully);
