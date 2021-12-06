import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../ReusableComponents/Spinner';
import { useTranslation, Trans } from 'react-i18next';
// import IncRequestPopup from '../IncRequestPopup';
import axios from 'axios';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { withRouter } from 'react-router-dom';
import { Text, Notice, Button } from '../../../UI-Components';
import BookingRequest from './bookingRequest';
import { connect } from 'react-redux';
import { getRedirectBase } from '../../../utils/getRedirectBase';

const IncomingRequests = ({ history, requests, stripeState, email }) => {
  const { t, ready } = useTranslation('IncomingRequests');

  const [errors, setErrors] = useState([]);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [stripeAccountErrors, setStripeAccountErrors] = useState([]);
  const [stripeAccountID, setStripeAccountID] = useState('');
  const [stripePendingVerification, setStripePendingVerification] = useState(false);
  const [stripeDashboardButtonLoading, setStripeDashboardButtonLoading] = useState(false);
  const [loading, setLoading] = useState(true)

  const fetchStripeAccountDetails = async () => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      try {
        const lang = detectLanguage();
        const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${requests[0].host_profile_id}&occasion=retrieve`;
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        const response = await axios.get(path, { headers: headers });
        if (!response.data.message) {
          console.log(response.data.requirements)
          setPayoutSuccess(response.data.payouts_enabled);
          setStripeAccountErrors(response.data.requirements.errors);
          setStripePendingVerification(!!response.data.requirements.pending_verification.length);
          setLoading(false)
        } else {
          setStripeAccountID(null);
          setLoading(false)
        }
      } catch ({ response }) {
        setLoading(false)
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 555) {
          setErrors([response.data.error]);
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors([response.data.error]);
        }
      }
    }
  };

  useEffect(() => {
    if (history.action === 'POP') {
      history.push({ pathname: '/all-bookings' });
    }
    if (requests.length > 0) {
      fetchStripeAccountDetails();
      return;
    }
    setLoading(false)
    // eslint-disable-next-line
  }, []);

  const fetchStripeDashboardLink = async () => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      try {
        setStripeDashboardButtonLoading(true);
        const lang = detectLanguage();
        const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${requests[0].host_profile_id}&occasion=login_link`;
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        const response = await axios.get(path, { headers: headers });
        window.open(response.data.url);
        setStripeDashboardButtonLoading(false);
      } catch ({ response }) {
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 555) {
          setErrors([response.data.error]);
          setStripeDashboardButtonLoading(false);
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors([response.data.error]);
          setStripeDashboardButtonLoading(false);
        }
      }
    }
  };

  if (!ready || loading) return <Spinner />;

  if (requests.length < 1) {
    return (
      <Text bold centered>
        {t('IncomingRequests:no-requests')}
      </Text>
    );
  }

  return (
    <>
      <Text centered bold space={6}>
        <Trans count={parseInt(requests.length)} i18nKey='IncomingRequests:requests-to-display'>
          You have received {{ count: requests.length }} booking request.
        </Trans>
      </Text>
      {errors.length > 0 && (
        <Notice nature='danger'>
          <Text bold centered size='sm'>
            {t('IncomingRequests:main-header-error')}
          </Text>
          <ul id='message-error-list'>
            {errors.map((error) => (
              <li key={error}>{t(error)}</li>
            ))}
          </ul>
        </Notice>
      )}

      {requests.map((request) => (
        <BookingRequest
          request={request}
          t={t}
          payoutSuccess={payoutSuccess}
          fetchStripeDashboardLink={() => fetchStripeDashboardLink()}
          stripeAccountID={stripeAccountID}
          stripeAccountErrors={stripeAccountErrors}
          stripePendingVerification={stripePendingVerification}
          onboardingUrl={`https://connect.stripe.com/express/oauth/authorize?client_id=${
            process.env.REACT_APP_OFFICIAL === 'yes'
              ? process.env.REACT_APP_STRIPE_CLIENT_ID
              : process.env.REACT_APP_STRIPE_CLIENT_ID_TEST
          }&response_type=code&state=${stripeState}&suggested_capabilities[]=transfers&redirect_uri=${getRedirectBase()}/all-bookings&stripe_user[email]=${email}&stripe_user[country]=SE`}
        />
      ))}
    </>
  );
};

const mapStateToProps = (state) => ({
  email: state.reduxTokenAuth.currentUser.attributes.uid,
  stripeState: state.hostProfile.data.stripe_state,
});

export default connect(mapStateToProps)(withRouter(IncomingRequests));
