import React, { useState } from 'react';
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { useTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';

const PasswordReset = ({ history }) => {
  const { t, ready } = useTranslation('PasswordReset');

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [loading, setLoading] = useState(false);

  const url =
    process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PASS_RESET : 'http://localhost:3000/change-password';

  const resetPassword = () => {
    setLoading(true);
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrorDisplay(true);
      setErrors(['reusable:errors:window-navigator']);
    } else {
      const lang = detectLanguage();
      const path = '/api/v1/auth/password';
      const payload = {
        redirect_url: url,
        email: email,
        locale: lang,
      };
      axios
        .post(path, payload)
        .then(() => {
          setErrorDisplay(false);
          history.push('/password-reset-success');
        })
        .catch(({ response }) => {
          if (response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 500) {
            setLoading(false);
            setErrorDisplay(true);
            setErrors(['reusable:errors:500']);
          } else if (response.status === 503) {
            wipeCredentials('/is-not-available?atm');
          } else {
            setLoading(false);
            setErrorDisplay(true);
            setErrors(response.data.errors);
          }
        });
    }
  };

  const listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      resetPassword();
    }
  };

  if (ready) {
    return (
      <div className='content-wrapper'>
        <Header as='h1'>{t('PasswordReset:title')}</Header>
        <Segment className='whitebox'>
          <p style={{ textAlign: 'center' }}>{t('PasswordReset:instructions')}</p>
          <Form>
            <Form.Input
              required
              id='email'
              label={t('reusable:plch.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('reusable:plch.email')}
              onKeyPress={listenEnterKey}
            />
          </Form>
          {errorDisplay && (
            <Message negative>
              <Message.Header style={{ textAlign: 'center' }}>{t('PasswordReset:error-header')}:</Message.Header>
              <ul id='message-error-list'>
                {errors.map((error) => (
                  <li key={error}>{t(error)}</li>
                ))}
              </ul>
            </Message>
          )}
          <Button
            className='submit-button'
            id='reset-pass-button'
            onClick={resetPassword}
            disabled={loading}
            loading={loading}
          >
            {t('PasswordReset:btn')}
          </Button>
        </Segment>
      </div>
    );
  } else {
    return <Spinner />;
  }
};

export default PasswordReset;
