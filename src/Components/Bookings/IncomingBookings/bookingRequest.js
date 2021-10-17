import React, { useState } from 'react';
import DeclineRequestPopup from '../declineRequestPopup';
import moment from 'moment';
import { Text, Header, Button, Flexbox } from '../../../UI-Components';
import { Trans } from 'react-i18next';
import axios from 'axios';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { BoxShadow, Section } from '../common/styles';
import { withRouter } from 'react-router-dom';

const BookingRequest = ({
  t,
  history,
  request,
  payoutSuccess,
  fetchStripeDashboardLink,
  stripeAccountID,
  stripeAccountErrors,
  stripePendingVerification,
  onboardingUrl,
}) => {
  const [closeOnDocumentClick, setCloseOnDocumentClick] = useState(true);
  const [declinePopupOpen, setDeclinePopupOpen] = useState(false);
  const [errors, setErrors] = useState([]);
  const [iconsDisabled, setIconsDisabled] = useState(false);

  const declModalCloseState = (state) => {
    setCloseOnDocumentClick(state);
  };

  const formatPrice = (price) => {
    const priceWithDecimalsString = price.toFixed(2);
    if (
      priceWithDecimalsString[priceWithDecimalsString.length - 1] === '0' &&
      priceWithDecimalsString[priceWithDecimalsString.length - 2] === '0'
    ) {
      return parseFloat(priceWithDecimalsString);
    } else {
      return priceWithDecimalsString;
    }
  };

  const acceptRequest = (e, requestData) => {
    const lang = detectLanguage();
    setIconsDisabled(true);
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
      setIconsDisabled(false);
      return;
    }
    if (window.confirm(t('IncomingRequests:accept-request'))) {
      const path = `/api/v1/bookings/${e.target.id}`;
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      const payload = {
        status: 'accepted',
        host_message: 'accepted by host',
        locale: lang,
      };
      axios
        .patch(path, payload, { headers: headers })
        .then(() => {
          history.push({
            pathname: '/request-accepted-success',
            state: {
              cats: requestData.number_of_cats,
              inDate: new Date(requestData.dates[0]),
              outDate: new Date(requestData.dates[requestData.dates.length - 1]),
              price: requestData.price_total,
              user: requestData.user.nickname,
            },
          });
        })
        .catch(({ response }) => {
          if (response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 500) {
            setErrors(['reusable:errors:500']);
            setIconsDisabled(false);
          } else if (response.status === 555 || response.status === 427) {
            window.alert(response.data.error);
            history.push('/all-bookings');
          } else if (response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/');
          } else {
            setErrors(response.data.error);
            setIconsDisabled(false);
          }
        });
    } else {
      setIconsDisabled(false);
    }
  };

  return (
    <BoxShadow data-cy='incoming-request' key={request.id} id={request.id}>
      <Section top neutral>
        <Header level={3} space={1}>
          {formatPrice(request.price_total)} kr
        </Header>
        <Text>
          <Trans i18nKey='IncomingRequests:must-reply'>
            You must reply before
            <strong>{{ date: moment(request.created_at).add(3, 'days').format('YYYY-MM-DD') }}</strong>
          </Trans>
        </Text>
      </Section>
      <Section>
        <Text space={6}>
          <Trans count={parseInt(request.number_of_cats)} i18nKey='IncomingRequests:book-a-stay'>
            <strong>{{ nickname: request.user.nickname }}</strong> wants to book a stay for their
            <strong>{{ count: request.number_of_cats }} cat</strong> during the dates of
            <strong>{{ startDate: moment(request.dates[0]).format('YYYY-MM-DD') }}</strong>
            until
            <strong>{{ endDate: moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
          </Trans>
        </Text>
        {payoutSuccess ? (
          <Flexbox spaceItemsX={3} data-cy='booking-request-cta-section'>
            <Button color='neutral' secondary onClick={() => setDeclinePopupOpen(true)} data-cy='decline-request'>
              {t('reusable:cta:decline')}
            </Button>
            <Button onClick={(e) => acceptRequest(e, request)} data-cy='accept-request' id={request.id}>{t('reusable:cta:accept')}</Button>
          </Flexbox>
        ) : stripeAccountID === null ? (
          <>
            <Header level={5} centered color='primary'>
              {t('reusable:important')}
            </Header>
            <Text centered>{t('IncomingRequests:stripe-step1')}</Text>
            <Button onClick={() => window.open(onboardingUrl, '_self')}>{t('reusable:stripe:onboarding-cta')}</Button>
          </>
        ) : stripeAccountErrors.length > 0 && stripePendingVerification ? (
          <Text centered>{t('IncomingRequests:stripe-step2-pending')}</Text>
        ) : (
          <>
            <Header level={5} centered color='primary'>
              {t('reusable:important')}
            </Header>
            <Text centered>{t('IncomingRequests:stripe-step2-complete-verification')}</Text>
            <Button onClick={() => fetchStripeDashboardLink()}>{t('reusable:stripe:stripe-dashboard-cta')}</Button>
          </>
        )}

        <DeclineRequestPopup
          id={request.id}
          nickname={request.user.nickname}
          startDate={moment(request.dates[0]).format('YYYY-MM-DD')}
          endDate={moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}
          declModalCloseState={declModalCloseState}
          open={declinePopupOpen}
        />
      </Section>
    </BoxShadow>
  );
};

export default withRouter(BookingRequest);
