import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Button, Header, Grid, Icon, Message } from 'semantic-ui-react';
import Popup from 'reactjs-popup';
import Spinner from '../ReusableComponents/Spinner';
import { useTranslation, Trans } from 'react-i18next';
import IncRequestPopup from './IncRequestPopup';
import DeclineRequestPopup from './DeclineRequestPopup';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { withRouter } from 'react-router-dom';
import { Popup as SemanticPopup } from 'semantic-ui-react';

const IncomingRequests = ({ history, requests }) => {
  const { t, ready } = useTranslation('IncomingRequests');

  const [loading, setLoading] = useState(true);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errors, setErrors] = useState([]);
  const [iconsDisabled, setIconsDisabled] = useState(false);
  const [closeOnDocumentClick, setCloseOnDocumentClick] = useState(true);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [stripeAccountErrors, setStripeAccountErrors] = useState([]);
  const [stripeAccountID, setStripeAccountID] = useState('');
  const [stripePendingVerification, setStripePendingVerification] = useState(false);
  const [stripeDashboardButtonLoading, setStripeDashboardButtonLoading] = useState(false);

  const axiosCallsErrorHandling = (errorDisplayState, errorMessage) => {
    setErrorDisplay(errorDisplayState);
    setErrors(errorMessage);
  };

  const fetchStripeAccountDetails = async () => {
    if (window.navigator.onLine === false) {
      setLoading(false);
      axiosCallsErrorHandling(true, ['reusable:errors:window-navigator']);
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
          setPayoutSuccess(response.data.payouts_enabled);
          setStripeAccountErrors(response.data.requirements.errors);
          setStripePendingVerification(response.data.requirements.pending_verification.length > 0 ? true : false);
          setLoading(false);
        } else {
          setStripeAccountID(null);
          setLoading(false);
        }
      } catch ({ response }) {
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 555) {
          setLoading(false);
          axiosCallsErrorHandling(true, [response.data.error]);
        } else if (response.status === 503) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setLoading(false);
          axiosCallsErrorHandling(true, [response.data.error]);
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
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const declModalCloseState = (state) => {
    setCloseOnDocumentClick(state);
  };

  const acceptRequest = (e, requestData) => {
    e.preventDefault();
    const lang = detectLanguage();
    setIconsDisabled(true);
    if (window.navigator.onLine === false) {
      axiosCallsErrorHandling(true, ['reusable:errors:window-navigator']);
      setIconsDisabled(false);
    } else {
      if (window.confirm(t('IncomingRequests:accept-request'))) {
        const path = `/api/v1/bookings/${e.target.id.split('-')[1]}`;
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
              axiosCallsErrorHandling(true, ['reusable:errors:500']);
              setIconsDisabled(false);
            } else if (response.status === 555 || response.status === 427) {
              window.alert(response.data.error);
              history.push('/all-bookings');
            } else if (response.status === 503) {
              wipeCredentials('/is-not-available?atm');
            } else if (response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else {
              axiosCallsErrorHandling(true, response.data.error);
              setIconsDisabled(false);
            }
          });
      } else {
        setIconsDisabled(false);
      }
    }
  };

  const fetchStripeDashboardLink = async () => {
    if (window.navigator.onLine === false) {
      axiosCallsErrorHandling(true, ['reusable:errors:window-navigator']);
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
          axiosCallsErrorHandling(true, [response.data.error]);
          setStripeDashboardButtonLoading(false);
        } else if (response.status === 503) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          axiosCallsErrorHandling(true, [response.data.error]);
          setStripeDashboardButtonLoading(false);
        }
      }
    }
  };

  if (ready && loading === false) {
    let sortedRequests = requests;
    sortedRequests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    let priceWithDecimalsString, total;

    return (
      <>
        {errorDisplay && (
          <Message negative>
            <Message.Header style={{ textAlign: 'center' }}>{t('IncomingRequests:main-header-error')}</Message.Header>
            <ul id='message-error-list'>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )}
        {requests.length > 0 ? (
          <>
            <p className='small-centered-paragraph'>
              <Trans count={parseInt(requests.length)} i18nKey='IncomingRequests:requests-to-display'>
                <strong>You have received {{ count: requests.length }} booking request.</strong>
              </Trans>
            </p>
            <p style={{ textAlign: 'center' }}>{t('IncomingRequests:requests-desc')}</p>
            {stripeAccountID === null ? (
              <>
                <p style={{ textAlign: 'center', margin: '2rem 0' }}>
                  <Trans i18nKey={'IncomingRequests:step-1-text'}>
                    You made a host profile but have not provided us with your payment information. Without that we
                    cannot transfer the money for your gigs! Please visit your&nbsp;
                    <Link to={'/user-page'}>
                      <span className='fake-link-underlined-reg'>profile page</span>
                    </Link>
                    &nbsp;to fix that.
                  </Trans>
                </p>
              </>
            ) : (
              stripeAccountErrors.length > 0 && (
                <>
                  <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: 'unset' }}>
                    {t('reusable:stripe:step-2-text')}&ensp;
                    {stripePendingVerification
                      ? t('reusable:stripe:step-2-pending')
                      : t('reusable:stripe:step-2-go-to-dashboard')}
                  </p>
                  {!stripePendingVerification && (
                    <Button
                      onClick={() => fetchStripeDashboardLink()}
                      loading={stripeDashboardButtonLoading}
                      disabled={stripeDashboardButtonLoading}
                      id='progress-bar-cta'
                      style={{ marginBottom: '2rem' }}
                    >
                      {t('reusable:stripe:stripe-dashboard-cta')}
                    </Button>
                  )}
                </>
              )
            )}
            {sortedRequests.map((request) => {
              priceWithDecimalsString = request.price_total.toFixed(2);
              if (
                priceWithDecimalsString[priceWithDecimalsString.length - 1] === '0' &&
                priceWithDecimalsString[priceWithDecimalsString.length - 2] === '0'
              ) {
                total = parseFloat(priceWithDecimalsString);
              } else {
                total = priceWithDecimalsString;
              }
              return (
                <div className='booking-request' data-cy='incoming-requests' key={request.id}>
                  <Grid style={{ background: '#c90c61', margin: '0' }}>
                    <Grid.Row style={{ alignItems: 'center' }}>
                      <Grid.Column width={8}>
                        <Header as='h2' style={{ color: 'white', marginBottom: '0', textAlign: 'left' }}>
                          {total} kr
                        </Header>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <Popup
                          modal
                          trigger={
                            <Icon
                              disabled={iconsDisabled}
                              id='decline'
                              name='plus circle'
                              style={{
                                color: '#ffffff',
                                opacity: '0.6',
                                transform: 'rotate(45deg)',
                                float: 'right',
                                cursor: 'pointer',
                              }}
                              size='big'
                            />
                          }
                          position='top center'
                          closeOnDocumentClick={closeOnDocumentClick}
                        >
                          <DeclineRequestPopup
                            id={request.id}
                            nickname={request.user.nickname}
                            startDate={moment(request.dates[0]).format('YYYY-MM-DD')}
                            endDate={moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}
                            declModalCloseState={declModalCloseState}
                          />
                        </Popup>
                        <SemanticPopup
                          basic
                          id={`popover-${request.id}`}
                          hoverable
                          hideOnScroll
                          disabled={payoutSuccess}
                          content={
                            stripeAccountID === null ? (
                              <>
                                <p style={{ textAlign: 'center' }}>
                                  <Trans i18nKey={'IncomingRequests:step-1-text'}>
                                    You made a host profile but have not provided us with your payment information.
                                    Without that we cannot transfer the money for your gigs! Please visit your&nbsp;
                                    <Link to={'/user-page'}>
                                      <span className='fake-link-underlined-reg'>profile page</span>
                                    </Link>
                                    &nbsp;to fix that.
                                  </Trans>
                                </p>
                              </>
                            ) : (
                              stripeAccountErrors.length > 0 && (
                                <>
                                  <p style={{ textAlign: 'center', fontSize: 'unset' }}>
                                    {t('reusable:stripe:step-2-text')}&ensp;
                                    {stripePendingVerification ? (
                                      t('reusable:stripe:step-2-pending')
                                    ) : (
                                      <Trans i18nKey={'IncomingRequest:stripe-step2-complete-verification'}>
                                        In order for you to accept a request, you should&nbsp;
                                        <span
                                          onClick={() => fetchStripeDashboardLink()}
                                          className='fake-link-underlined'
                                        >
                                          complete your verification
                                        </span>
                                        &nbsp;with our payment provider (Stripe).
                                      </Trans>
                                    )}
                                  </p>
                                </>
                              )
                            )
                          }
                          trigger={
                            <Icon
                              disabled={
                                iconsDisabled || payoutSuccess === false || payoutSuccess === undefined ? true : false
                              }
                              id={`accept-${request.id}`}
                              onClick={(e) => acceptRequest(e, request)}
                              name='check circle'
                              style={{ color: '#ffffff', float: 'right', cursor: 'pointer' }}
                              size='big'
                            />
                          }
                        />
                      </Grid.Column>
                    </Grid.Row>
                    <div>
                      <p style={{ color: '#ffffff', fontSize: 'small', marginBottom: '1rem', marginTop: '-0.5rem' }}>
                        <Trans i18nKey='IncomingRequests:must-reply'>
                          You must reply before
                          <strong>{{ date: moment(request.created_at).add(3, 'days').format('YYYY-MM-DD') }}</strong>
                        </Trans>
                      </p>
                    </div>
                  </Grid>
                  <div style={{ padding: '2rem' }}>
                    <p className='small-centered-paragraph'>
                      <Trans count={parseInt(request.number_of_cats)} i18nKey='IncomingRequests:book-a-stay'>
                        <strong style={{ color: '#c90c61' }}>{{ nickname: request.user.nickname }}</strong> wants to
                        book a stay for their
                        <strong style={{ color: '#c90c61' }}>{{ count: request.number_of_cats }} cat</strong> during the
                        dates of
                        <strong style={{ color: '#c90c61' }}>
                          {{ startDate: moment(request.dates[0]).format('YYYY-MM-DD') }}
                        </strong>
                        until
                        <strong style={{ color: '#c90c61' }}>
                          {{ endDate: moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD') }}
                        </strong>
                        .
                      </Trans>
                    </p>
                    <Popup
                      modal
                      trigger={<p className='fake-link-underlined'>{t('IncomingRequests:view-message')}</p>}
                      position='top center'
                      closeOnDocumentClick={true}
                    >
                      <IncRequestPopup
                        nickname={request.user.nickname}
                        number_of_cats={request.number_of_cats}
                        startDate={moment(request.dates[0]).format('YYYY-MM-DD')}
                        endDate={moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}
                        message={request.message}
                        avatar={request.user.profile_avatar}
                      />
                    </Popup>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <p className='small-centered-paragraph'>
              <strong>{t('IncomingRequests:no-requests')}</strong>
            </p>
          </>
        )}
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default withRouter(IncomingRequests);
