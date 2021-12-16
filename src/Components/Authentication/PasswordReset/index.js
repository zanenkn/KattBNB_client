import React, { useState } from 'react';
import axios from 'axios';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { useTranslation } from 'react-i18next';
import Spinner from '../../../common/Spinner';
import { Header, Container, Text, TextField, Whitebox, Button, Notice, ContentWrapper } from '../../../UI-Components';
// Completely MIGRATED

const PasswordReset = ({ history }) => {
  const { t, ready } = useTranslation('PasswordReset');
  const lang = detectLanguage();

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
    if (window.navigator.onLine === false) {
      return setErrors(['reusable:errors:window-navigator']);
    }

    setLoading(true);
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
  };

  if (!ready) {
    return <Spinner />;
  }

  return (
    <ContentWrapper>
      <Header centered color='primary'>
        {t('PasswordReset:title')}
      </Header>

      <Whitebox>
        <Text centered>{t('PasswordReset:instructions')}</Text>

        <Container space={6}>
          <TextField
            required
            data-cy='email'
            label={t('reusable:plch.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={listenEnterKey}
          />
        </Container>

        {errors.length > 0 && (
          <Notice data-cy='error-notice' nature='danger'>
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

        <Button data-cy='reset-pass-button' onClick={resetPassword} disabled={loading} loading={loading}>
          {t('PasswordReset:btn')}
        </Button>
      </Whitebox>
    </ContentWrapper>
  );
};

export default PasswordReset;
