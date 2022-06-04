import { useState, useEffect } from 'react';

import axios from 'axios';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { useFetchHost } from '../HostPopup/useFetchHost';
import { connect } from 'react-redux';

import { Header, TextArea, Notice, Text, Flexbox, Button, InlineLink } from '../../../UI-Components';
import { Amex, Mastercard, Visa, Stripe, User } from '../../../icons';
import Spinner from '../../../common/Spinner';
import { formValidation } from '../../../Modules/formValidation';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { pricePerDay, hostTotal, finalTotal } from '../../../Modules/PriceCalculations';

import StripeCardDetails from './stripeCardDetails';
import { CardNumberElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { InnerResultWrapper } from '../styles';

const RequestToBook = ({ id, currentSearch, userId, toHost, toResults }) => {
  const { t, ready } = useTranslation('RequestToBook');
  const history = useHistory();
  const { host } = useFetchHost(id);
  const lang = detectLanguage();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [paymentProcessingDisplay, setPaymentProcessingDisplay] = useState(false);
  const [perDay, setPerDay] = useState('');
  const [orderTotal, setOrderTotal] = useState('');
  const [paymentIntent, setPaymentIntent] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const validator = formValidation({
    fields: [
      {
        condition: window.navigator.onLine === false,
        error: 'reusable:errors:window-navigator',
      },
      {
        condition: !stripe || !elements,
        error: 'RequestToBook:stripe-elements-error',
      },
      {
        condition: !message,
        error: 'RequestToBook:error-1',
      },
      {
        condition: message.length > 400,
        error: 'RequestToBook:error-2',
      },
      {
        condition: cardholderName === '' || postalCode === '' || postalCode < 0 || postalCode.length !== 5,
        error: 'RequestToBook:card-details-error',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  const createPaymentIntent = async () => {
    try {
      const amount = finalTotal(
        host?.rate,
        currentSearch.cats,
        host?.supplement,
        currentSearch.start,
        currentSearch.end
      );
      const path = `/api/v1/stripe?locale=${lang}&occasion=create_payment_intent&amount=${amount}&currency=sek&inDate=${currentSearch.start}&outDate=${currentSearch.end}&cats=${currentSearch.cats}&host=${host.name}`;
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      const response = await axios.get(path, { headers: headers });

      setPaymentIntent(response.data.intent_id);
    } catch ({ response }) {
      setLoading(false);
      if (response === undefined) {
        setErrors(['reusable:errors.unknown']);
      } else if (response.status === 555) {
        window.alert(t('RequestToBook:error-555'));
        history.push('/search');
      } else if (response.status === 401) {
        window.alert(t('reusable:errors.401'));
        wipeCredentials('/');
      } else {
        setErrors([response.data.error]);
      }
    }
  };

  useEffect(() => {
    window.scroll(0, 0)
    // what do here? without restricting the url from being accessed directly

    // if (history.action === 'POP') {
    //   history.push({ pathname: '/' });
    // } else {
    if (host) {
      setPerDay(pricePerDay(host.rate, currentSearch.cats, host.supplement, currentSearch.start, currentSearch.end));
      setOrderTotal(finalTotal(host.rate, currentSearch.cats, host.supplement, currentSearch.start, currentSearch.end));
      createPaymentIntent();
    }
    //eslint-disable-next-line
  }, [host]);

  const createBooking = (paymentIntentId) => {
    let totalToPayHost = hostTotal(
      host.rate,
      currentSearch.cats,
      host.supplement,
      currentSearch.start,
      currentSearch.end
    );

    const path = '/api/v1/bookings';
    const payload = {
      number_of_cats: currentSearch.cats,
      message: message,
      dates: currentSearch.dates,
      host_nickname: host.name,
      price_per_day: perDay,
      price_total: totalToPayHost,
      user_id: userId,
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
            numberOfCats: currentSearch.cats,
            checkInDate: currentSearch.start,
            checkOutDate: currentSearch.end,
            nickname: host.name,
          },
        });
      })
      .catch(({ response }) => {
        setLoading(false);
        if (response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (response.status === 500) {
          setErrors(['reusable:errors:500']);
          setPaymentProcessingDisplay(false);
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors(response.data.error);
          setPaymentProcessingDisplay(false);
        }
      });
  };

  const createBookingAndPay = async () => {
    setLoading(true);
    setErrors([]);
    setPaymentProcessingDisplay(true);

    let booking = currentSearch.dates;
    let totalToPayHost = hostTotal(
      host.rate,
      currentSearch.cats,
      host.supplement,
      currentSearch.start,
      currentSearch.end
    );

    const path = `/api/v1/stripe?occasion=update_payment_intent&locale=${lang}&number_of_cats=${currentSearch.cats}&message=${message}&dates=${booking}&host_nickname=${host.name}&price_per_day=${perDay}&price_total=${totalToPayHost}&user_id=${id}&payment_intent_id=${paymentIntent}`;
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
        setErrors([result.error.message]);
        setPaymentProcessingDisplay(false);
      } else {
        if (result.paymentIntent.status === 'requires_capture') {
          createBooking(result.paymentIntent.id);
        }
      }
    } catch ({ response }) {
      setLoading(false);
      if (response === undefined) {
        setErrors(['reusable:errors.unknown']);
      } else if (response.status === 555) {
        setErrors([response.data.error]);
        setPaymentProcessingDisplay(false);
      } else if (response.status === 401) {
        window.alert(t('reusable:errors:401'));
        wipeCredentials('/');
      } else {
        setErrors([response.data.error]);
        setPaymentProcessingDisplay(false);
      }
    }
    //}
    // }
  };

  if (!ready || !host) return <Spinner />;

  return (
    <InnerResultWrapper>
      <Flexbox spaceItemsX={1} horizontalAlign={'left'} wrap space={4} verticalAlign={'baseline'}>
        <Header level={4}>Request to book with</Header>
        <Header level={4}>
          <InlineLink color={'primary'} onClick={() => toHost(host.userId)}>
            {host.name}
          </InlineLink>
        </Header>
        <InlineLink onClick={() => toResults()} text={'sm'} color='info'>
          {t('reusable:cta.change')}
        </InlineLink>
      </Flexbox>

      <TextArea
        label={t('reusable:plch.message')}
        //placeholder={t('RequestToBook:message-plch')}
        required
        data-cy='message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Text size='sm' italic right data-cy='remaining-characters'>
        {t('reusable:remaining-chars')} {400 - message.length}
      </Text>
      {/* <Flexbox spaceItemsX={1}>
        <Visa height={5} />
        <Mastercard height={5} />
        <Amex height={5} />
      </Flexbox> */}

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
        </div>
        {errors.length > 0 && (
          <Notice nature='danger' data-cy='error'>
            <ul>
              {errors.map((error) => (
                <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
              ))}
            </ul>
          </Notice>
        )}
        <Button
          onClick={() => validator.onSubmit(createBookingAndPay)}
          id='request-to-book-button'
          disabled={loading}
          loading={loading}
        >
          {t('reusable:request-cta.pay-btn')} {orderTotal} kr
        </Button>
        <Text>
          <Trans i18nKey='RequestToBook:smallprint'>
            Text
            <InlineLink color='info' href='https://stripe.com/about'>
              Link
            </InlineLink>
            text
            <InlineLink color='info' to='/faq?section=payments&active=503'>
              link
            </InlineLink>
            .
          </Trans>
        </Text>
        <Flexbox>
          <Stripe height={6} tint={40} />
        </Flexbox>

        {paymentProcessingDisplay && (
          <div
            style={{
              width: '100vw',
              height: '100vh',
              position: 'fixed',
              zIndex: 10000,
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
      </>
    </InnerResultWrapper>
  );
};

const mapStateToProps = (state) => ({
  userId: state.reduxTokenAuth.currentUser.attributes.id,
  locationRedux: state.reduxTokenAuth.currentUser.attributes.location,
  currentSearch: state.currentSearch,
});

export default connect(mapStateToProps)(RequestToBook);
