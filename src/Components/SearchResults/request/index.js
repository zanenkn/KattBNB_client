import { useState, useEffect } from 'react';

import axios from 'axios';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useFetchHost } from '../HostPopup/useFetchHost';
import { connect } from 'react-redux';
import { CardNumberElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Helmet } from 'react-helmet';

import { formValidation } from '../../../Modules/formValidation';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { pricePerDay, hostTotal, finalTotal } from '../../../Modules/PriceCalculations';

import Spinner from '../../../common/Spinner';

import { Header, TextArea, Notice, Text, Flexbox, Button, InlineLink, Avatar } from '../../../UI-Components';
import { Stripe } from '../../../icons';
import { InnerResultWrapper } from '../styles';
import CheckoutForm from './checkoutForm';
import PaymentProcessingDisplay from './paymentProcessingDisplay';
import { getAvatar } from '../../../Modules/getAvatar';

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
  const [paymentProcessing, setPaymentProcessing] = useState(false);
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
        history.push('/login')
      } else {
        setErrors([response.data.error]);
      }
    }
  };

  useEffect(() => {
    window.scroll(0, 0);

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
            cats: currentSearch.cats,
            start: currentSearch.start,
            end: currentSearch.end,
            name: host.name,
            avatar: host.avatar,
            place: currentSearch.location,
          },
        });
      })
      .catch(({ response }) => {
        setLoading(false);
        if (response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (response.status === 500) {
          setErrors(['reusable:errors:500']);
          setPaymentProcessing(false);
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors(response.data.error);
          setPaymentProcessing(false);
        }
      });
  };

  const createBookingAndPay = async () => {
    setLoading(true);
    setErrors([]);
    setPaymentProcessing(true);

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
        setPaymentProcessing(false);
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
        setPaymentProcessing(false);
      } else if (response.status === 401) {
        window.alert(t('reusable:errors:401'));
        wipeCredentials('/');
      } else {
        setErrors([response.data.error]);
        setPaymentProcessing(false);
      }
    }
  };

  if (!ready || !host) return <Spinner />;

  return (
    <InnerResultWrapper>
      <Helmet
        bodyAttributes={{
          class: paymentProcessing ? 'overflow-hidden' : 'overflow-auto',
        }}
      />
      <Flexbox spaceItemsX={1} horizontalAlign={'left'} wrap space={4}>
        <Header level={4}>{t('RequestToBook:request-with')}</Header>
        <Flexbox>
          <Avatar src={host.avatar ?? getAvatar(host.name)} size={'sm'} />
          <Flexbox verticalAlign={'baseline'} spaceItemsX={1}>
            <Header level={4}>
              <InlineLink onClick={() => toHost(host.userId)}>&nbsp;{host.name}</InlineLink>
            </Header>
            <InlineLink onClick={() => toResults()} text={'sm'} color='info'>
              {t('reusable:cta.change')}
            </InlineLink>
          </Flexbox>
        </Flexbox>
      </Flexbox>

      <TextArea
        label={t('reusable:plch.message')}
        required
        data-cy='message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        space={0}
      />
      <Text size='sm' italic right data-cy='remaining-characters'>
        {t('reusable:remaining-chars')} {400 - message.length}
      </Text>
      <>
        <CheckoutForm
          onChangeCardHolder={(val) => setCardholderName(val)}
          onChangePostalCode={(val) => setPostalCode(val)}
          cardholderName={cardholderName}
          postalCode={postalCode}
          t={t}
        />
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
          data-cy='submit'
          disabled={loading}
          loading={loading}
          space={6}
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
        {paymentProcessing && <PaymentProcessingDisplay t={t} />}
      </>
    </InnerResultWrapper>
  );
};

const mapStateToProps = (state) => ({
  userId: state.reduxTokenAuth.currentUser.attributes.id,
  currentSearch: state.currentSearch,
});

export default connect(mapStateToProps)(RequestToBook);
