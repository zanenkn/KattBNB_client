import React, { useState } from 'react';
import axios from 'axios';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { useTranslation } from 'react-i18next';
import Spinner from '../../ReusableComponents/Spinner';
import { Header, Container, Text, TextField, Whitebox, Button, Notice } from '../../../UI-Components';
// MIGRATION IN PROGRESS
const PasswordReset = ({ history }) => {
  const { t, ready } = useTranslation('PasswordReset');

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const url =
    process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PASS_RESET : 'http://localhost:3000/change-password';

  const listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      resetPassword();
    }
  };

  const axiosCallErrors = (errorMessage) => {
    setLoading(false);
    setErrors(errorMessage);
  };

  const resetPassword = () => {
    setLoading(true);
    if (window.navigator.onLine === false) {
      axiosCallErrors(['reusable:errors:window-navigator']);
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
          setErrors([]);
          history.push('/password-reset-success');
        })
        .catch(({ response }) => {
          if (response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 500) {
            axiosCallErrors(['reusable:errors:500']);
          } else {
            axiosCallErrors(response.data.errors);
          }
        });
    }
  };

  if (!ready) {
    return <Spinner />;
  }

  return (
    <>
      <Header centered color='primary'>
        {t('PasswordReset:title')}
      </Header>
      <Whitebox>
        <Text centered>{t('PasswordReset:instructions')}</Text>
        <Container space={6}>
          <TextField
            required
            id='email'
            label={t('reusable:plch.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={listenEnterKey}
          />
        </Container>
        {errors.length > 0 && (
          <Notice nature='danger'>
            <Header level={5} centered>
              {t('PasswordReset:error-header')}:
            </Header>
            <ul id='message-error-list'>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Notice>
        )}
        <Button id='reset-pass-button' onClick={resetPassword} disabled={loading} loading={loading}>
          {t('PasswordReset:btn')}
        </Button>
      </Whitebox>
    </>
  );
};

export default PasswordReset;
