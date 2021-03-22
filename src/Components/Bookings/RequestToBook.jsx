import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Header, Form, Button, Message, Segment, Icon, Divider } from 'semantic-ui-react';
import Spinner from '../ReusableComponents/Spinner';
import moment from 'moment';
import axios from 'axios';
import StripeCardDetails from './StripeCardDetails';
import { ElementsConsumer, CardNumberElement } from '@stripe/react-stripe-js';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { pricePerDay, hostTotal, finalTotal } from '../../Modules/PriceCalculations';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Visa from '../Icons/Visa';
import Mastercard from '../Icons/Mastercard';
import Amex from '../Icons/Amex';
import Stripe from '../Icons/Stripe';

const RequestToBook = (props) => {
  const { t, ready } = useTranslation('RequestToBook');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errors, setErrors] = useState([]);
  const [stripePaymentProcessingDisplay, setStripePaymentProcessingDisplay] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [perDay, setPerDay] = useState('');
  const [orderTotal, setOrderTotal] = useState('');
  const [numberOfCats, setNumberOfCats] = useState('');
  const [nickname, setNickname] = useState('');
  const [paymentIntent, setPaymentIntent] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const axiosCallsErrorHandling = (errorMessage) => {
    setLoading(false);
    setErrorDisplay(true);
    setErrors(errorMessage);
  };

  const createPaymentIntent = async () => {
    const {
      history,
      locationRedux,
      location: {
        state: { checkInDate, checkOutDate, hostRate, hostSupplement, nickname, numberOfCats },
      },
    } = props;
    if (window.navigator.onLine === false) {
      axiosCallsErrorHandling(['reusable:errors:window-navigator']);
    } else {
      try {
        const lang = detectLanguage();
        const amount = finalTotal(hostRate, numberOfCats, hostSupplement, checkInDate, checkOutDate);
        const path = `/api/v1/stripe?locale=${lang}&occasion=create_payment_intent&amount=${amount}&currency=sek&inDate=${checkInDate}&outDate=${checkOutDate}&cats=${numberOfCats}&host=${nickname}`;
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        const response = await axios.get(path, { headers: headers });
        setPaymentIntent(response.data.intent_id);
      } catch ({ response }) {
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 555) {
          window.alert(t('RequestToBook:error-555'));
          history.push({
            pathname: '/search',
            state: {
              checkInDate: new Date(checkInDate),
              checkOutDate: new Date(checkOutDate),
              location: locationRedux,
              numberOfCats: numberOfCats,
            },
          });
        } else if (response.status === 503) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          axiosCallsErrorHandling([response.data.error]);
        }
      }
    }
  };

  useEffect(() => {
    if (props.history.location.state === undefined || props.history.action === 'POP') {
      props.history.push({ pathname: '/' });
    } else {
      const {
        location: {
          state: { checkInDate, checkOutDate, hostRate, hostSupplement, nickname, numberOfCats },
        },
      } = props;
      setCheckIn(moment(checkInDate).format('l'));
      setCheckOut(moment(checkOutDate).format('l'));
      setPerDay(pricePerDay(hostRate, numberOfCats, hostSupplement, checkInDate, checkOutDate));
      setOrderTotal(finalTotal(hostRate, numberOfCats, hostSupplement, checkInDate, checkOutDate));
      setNumberOfCats(numberOfCats);
      setNickname(nickname);
      createPaymentIntent();
    }
    // eslint-disable-next-line
  }, []);

  const createBooking = (paymentIntentId) => {
    const {
      id,
      history,
      location: {
        state: { checkInDate, checkOutDate, hostRate, hostSupplement, nickname, numberOfCats },
      },
    } = props;
    const lang = detectLanguage();
    let booking = [];
    let totalToPayHost = hostTotal(hostRate, numberOfCats, hostSupplement, checkInDate, checkOutDate);
    let startDate = checkInDate;
    let stopDate = checkOutDate;
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      booking.push(currentDate);
      currentDate = currentDate + 86400000;
    }
    const path = '/api/v1/bookings';
    const payload = {
      number_of_cats: numberOfCats,
      message: message,
      dates: booking,
      host_nickname: nickname,
      price_per_day: perDay,
      price_total: totalToPayHost,
      user_id: id,
      payment_intent_id: paymentIntentId,
      locale: lang,
    };
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    axios
      .post(path, payload, { headers: headers })
      .then(() => {
        history.push({
          pathname: '/successful-request',
          state: {
            numberOfCats: numberOfCats,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            nickname: nickname,
          },
        });
      })
      .catch(({ response }) => {
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 500) {
          axiosCallsErrorHandling(['reusable:errors:500']);
          setStripePaymentProcessingDisplay(false);
        } else if (response.status === 503) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          axiosCallsErrorHandling(response.data.error);
          setStripePaymentProcessingDisplay(false);
        }
      });
  };

  const createBookingAndPay = async (event, stripe, elements) => {
    const {
      id,
      location: {
        state: { checkInDate, checkOutDate, hostRate, hostSupplement, nickname, numberOfCats },
      },
    } = props;
    event.preventDefault();
    setLoading(true);
    setErrorDisplay(false);
    setErrors([]);
    if (window.navigator.onLine === false) {
      axiosCallsErrorHandling(['reusable:errors:window-navigator']);
    } else {
      if (!stripe || !elements) {
        axiosCallsErrorHandling(['RequestToBook:stripe-elements-error']);
        return;
      }
      if (message === '') {
        axiosCallsErrorHandling(['RequestToBook:error-1']);
      } else if (message.length > 400) {
        axiosCallsErrorHandling(['RequestToBook:error-2']);
      } else if (cardholderName === '' || postalCode === '' || postalCode < 0 || postalCode.length !== 5) {
        axiosCallsErrorHandling(['RequestToBook:card-details-error']);
      } else {
        setStripePaymentProcessingDisplay(true);
        const lang = detectLanguage();
        let booking = [];
        let totalToPayHost = hostTotal(hostRate, numberOfCats, hostSupplement, checkInDate, checkOutDate);
        let startDate = checkInDate;
        let stopDate = checkOutDate;
        let currentDate = startDate;
        while (currentDate <= stopDate) {
          booking.push(currentDate);
          currentDate = currentDate + 86400000;
        }
        const path = `/api/v1/stripe?occasion=update_payment_intent&locale=${lang}&number_of_cats=${numberOfCats}&message=${message}&dates=${booking}&host_nickname=${nickname}&price_per_day=${perDay}&price_total=${totalToPayHost}&user_id=${id}&payment_intent_id=${paymentIntent}`;
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        try {
          // eslint-disable-next-line
          const responseUpdateIntent = await axios.get(path, { headers: headers });
          const result = await stripe.confirmCardPayment(paymentIntent, {
            payment_method: {
              card: elements.getElement(CardNumberElement),
              billing_details: {
                name: cardholderName,
                address: {
                  postal_code: postalCode,
                },
              },
            },
          });
          if (result.error) {
            axiosCallsErrorHandling([result.error.message]);
            setStripePaymentProcessingDisplay(false);
          } else {
            if (result.paymentIntent.status === 'requires_capture') {
              createBooking(result.paymentIntent.id);
            }
          }
        } catch ({ response }) {
          if (response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 555) {
            axiosCallsErrorHandling([response.data.error]);
            setStripePaymentProcessingDisplay(false);
          } else if (response.status === 503) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/');
          } else {
            axiosCallsErrorHandling([response.data.error]);
            setStripePaymentProcessingDisplay(false);
          }
        }
      }
    }
  };

  if (ready) {
    let messageLength = 400 - message.length;

    return (
      <div className='content-wrapper'>
        <Header as='h1'>{t('RequestToBook:title')}</Header>
        <Segment className='whitebox'>
          <p className='small-centered-paragraph' style={{ marginBottom: '0.5rem' }}>
            <Trans i18nKey='RequestToBook:request-info' count={parseInt(numberOfCats)}>
              You are requesting a booking for
              <strong style={{ color: '#c90c61' }}>{{ count: numberOfCats }} cat</strong> with
              <strong style={{ color: '#c90c61' }}>{{ host: nickname }}</strong> during the dates of
              <strong style={{ color: '#c90c61' }}>{{ checkin: checkIn }}</strong> until
              <strong style={{ color: '#c90c61' }}>{{ checkout: checkOut }}</strong>.
            </Trans>
          </p>
          <Form>
            <Form.TextArea
              label={t('reusable:plch.message')}
              placeholder={t('RequestToBook:message-plch')}
              required
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form>
          <p style={{ textAlign: 'end', fontSize: 'smaller', fontStyle: 'italic' }}>
            {t('reusable:remaining-chars')} {messageLength}
          </p>
          <Divider horizontal>
            <div style={{ width: '135px', display: 'flex', justifyContent: 'space-between', margin: '1rem auto' }}>
              <Visa height={'2rem'} />
              <Mastercard height={'2rem'} />
              <Amex height={'2rem'} />
            </div>
          </Divider>
          <ElementsConsumer>
            {({ stripe, elements }) => (
              <>
                <div className='payment-wrapper'>
                  <StripeCardDetails
                    onChangeCardHolder={(e) => setCardholderName(e.target.value)}
                    onChangePostalCode={(e) => setPostalCode(e.target.value)}
                    cardholderName={cardholderName}
                    postalCode={postalCode}
                    stripe={stripe}
                    elements={elements}
                  />
                  <div className='order-total'>
                    <p className='small-centered-paragraph' style={{ marginBottom: '0.5rem' }}>
                      {t('RequestToBook:agree-to-pay')}
                    </p>
                    <Header id='total' as='h3' style={{ marginTop: '0', marginBottom: '0' }}>
                      {orderTotal} kr
                    </Header>
                    <Header id='total' as='h5' style={{ marginTop: '0' }}>
                      ({perDay} {t('reusable:price.per-day')})
                    </Header>
                  </div>
                </div>
                {errorDisplay && (
                  <Message negative>
                    <Message.Header>{t('RequestToBook:error-header')}</Message.Header>
                    <ul>
                      {errors.map((error) => (
                        <li key={error}>{t(error)}</li>
                      ))}
                    </ul>
                  </Message>
                )}
                <Button
                  onClick={(e) => createBookingAndPay(e, stripe, elements)}
                  id='request-to-book-button'
                  disabled={loading}
                  loading={loading}
                >
                  <Icon fitted name='lock' /> &nbsp; {t('reusable:request-cta.pay-btn')} {orderTotal} kr
                </Button>
                <p className='smallprint' style={{ marginTop: '2rem' }}>
                  <Trans i18nKey='RequestToBook:smallprint'>
                    Our payment provider is <a href='https://stripe.com/about'>Stripe</a>. When you request the booking
                    we reserve the amount shown above from your bank card. Host then will have 3 days to accept or
                    decline your booking request. In an event of cancelled or declined booking request, the reserved
                    amount will be released within 7 days of the initial request date. You can read more on how we
                    handle payments <Link to='/faq?section=payments&active=503'>in our FAQ</Link>.
                  </Trans>
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                  <Stripe height={'2rem'} />
                </div>
              </>
            )}
          </ElementsConsumer>
        </Segment>
        {stripePaymentProcessingDisplay && (
          <div
            style={{
              width: '100vw',
              height: '100vh',
              position: 'fixed',
              top: '0',
              left: '0',
              backdropFilter: 'blur(2rem)',
            }}
          >
            <div style={{ margin: '13rem auto 0' }}>
              <Spinner />
            </div>
            <div style={{ textAlign: 'center', margin: '2rem auto', maxWidth: '300px' }}>
              <Header>{t('RequestToBook:payment-processed-header')}</Header>
              <p>{t('RequestToBook:payment-processed-text')}</p>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return <Spinner />;
  }
};

const mapStateToProps = (state) => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
  locationRedux: state.reduxTokenAuth.currentUser.attributes.location,
});

export default connect(mapStateToProps)(RequestToBook);
