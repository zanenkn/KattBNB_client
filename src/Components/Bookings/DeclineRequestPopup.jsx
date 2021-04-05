import React, { useState } from 'react';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import Spinner from '../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';

const DeclineRequestPopup = (props) => {
  const { t, ready } = useTranslation('DeclineRequestPopup');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errors, setErrors] = useState('');

  const declineBooking = (e) => {
    e.preventDefault();
    const lang = detectLanguage();
    setLoading(true);
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrorDisplay(true);
      setErrors(['reusable:errors:window-navigator']);
      props.declModalCloseState(true);
    } else {
      if (window.confirm(t('DeclineRequestPopup:confirm-decline'))) {
        if (message !== '' && message.length < 201) {
          const path = `/api/v1/bookings/${props.id}`;
          const headers = {
            uid: window.localStorage.getItem('uid'),
            client: window.localStorage.getItem('client'),
            'access-token': window.localStorage.getItem('access-token'),
          };
          const payload = {
            host_message: message,
            status: 'declined',
            locale: lang,
          };
          axios
            .patch(path, payload, { headers: headers })
            .then(() => {
              window.location.replace('/all-bookings');
            })
            .catch((error) => {
              if (error.response === undefined) {
                wipeCredentials('/is-not-available?atm');
              } else if (error.response.status === 500) {
                setLoading(false);
                setErrorDisplay(true);
                setErrors(['reusable:errors:500']);
                props.declModalCloseState(true);
              } else if (error.response.status === 401) {
                window.alert(t('reusable:errors:401'));
                wipeCredentials('/');
              } else {
                setLoading(false);
                setErrorDisplay(true);
                setErrors(error.response.data.error);
                props.declModalCloseState(true);
              }
            });
        } else {
          setLoading(false);
          setErrorDisplay(true);
          setErrors(['DeclineRequestPopup:decline-error']);
          props.declModalCloseState(true);
        }
      } else {
        setLoading(false);
        props.declModalCloseState(true);
      }
    }
  };

  const declineCTA = (e) => {
    props.declModalCloseState(false);
    declineBooking(e);
  };

  if (ready) {
    return (
      <>
        <Header as='h2'>{t('DeclineRequestPopup:page-header')}</Header>
        <p className='small-centered-paragraph'>
          <Trans i18nKey='DeclineRequestPopup:page-desc'>
            You are about to decline a booking request from
            <strong style={{ color: '#c90c61' }}>{{ nickname: props.nickname }}</strong> for the dates of
            <strong style={{ color: '#c90c61' }}>{{ startDate: props.startDate }}</strong> until
            <strong style={{ color: '#c90c61' }}>{{ endDate: props.endDate }}</strong>
          </Trans>
        </p>
        <Form>
          <Form.TextArea
            style={{ minHeight: '120px' }}
            label={t('DeclineRequestPopup:text-area-label')}
            placeholder={t('DeclineRequestPopup:text-area-plch')}
            required
            id='message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form>
        <p style={{ textAlign: 'end', fontSize: 'smaller', fontStyle: 'italic' }}>
          {t('reusable:remaining-chars')} {200 - message.length}
        </p>
        {errorDisplay && (
          <Message negative>
            <Message.Header style={{ textAlign: 'center' }}>
              {t('DeclineRequestPopup:error-message-header')}
            </Message.Header>
            <ul id='message-error-list'>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )}
        <Button id='decline-button' disabled={loading} loading={loading} onClick={declineCTA}>
          {t('DeclineRequestPopup:decline-cta')}
        </Button>
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default DeclineRequestPopup;
