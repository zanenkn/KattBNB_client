import React, { useState } from 'react';
import axios from 'axios';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { passwordCheck } from '../../../Modules/passwordCheck';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import Spinner from '../../../common/Spinner';
import { Header, Container, Text, TextField, Whitebox, Button, Notice, ContentWrapper } from '../../../UI-Components';
// Completely MIGRATED

const ChangePassword = ({ location: { search } }) => {
  const { t, ready } = useTranslation('ChangePassword');
  const lang = detectLanguage();

  const [errors, setErrors] = useState([]);
  const [successDisplay, setSuccessDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      changePassword();
    }
  };

  const axiosCallErrorCatching = (errorMessage) => {
    setLoading(false);
    setErrors(errorMessage);
  };

  const changePassword = () => {
    if (window.navigator.onLine === false) {
      return setErrors(['reusable:errors:window-navigator']);
    }

    if (password === passwordConfirmation && passwordCheck(password) && search.length < 150) {
      return setErrors(['ChangePassword:error-1']);
    }

    if ((password === passwordConfirmation && !passwordCheck(password)) || password !== passwordConfirmation) {
      return setErrors(['ChangePassword:error-2']);
    }

    setLoading(true);
    const path = '/api/v1/auth/password';
    const payload = {
      password: password,
      password_confirmation: passwordConfirmation,
      uid: queryString.parse(search).uid,
      'access-token': queryString.parse(search).token,
      client: queryString.parse(search).client,
      locale: lang,
    };
    axios
      .put(path, payload)
      .then(() => {
        setSuccessDisplay(true);
        setErrors([]);
        setTimeout(function () {
          window.location.replace('/login');
        }, 2000);
      })
      .catch(({ response }) => {
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 500) {
          axiosCallErrorCatching(['reusable:errors:500']);
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401-password'));
          wipeCredentials('/password-reset');
        } else {
          axiosCallErrorCatching(response.data.errors.full_messages);
        }
      });
  };

  if (!ready) {
    return <Spinner page />;
  }

  return (
    <ContentWrapper>
      <Header centered color='primary'>
        {t('ChangePassword:title')}
      </Header>

      <Whitebox>
        <Text centered>{t('ChangePassword:instructions')}</Text>
        <Container space={6}>
          <TextField
            required
            data-cy='password'
            label={t('reusable:plch.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            onKeyPress={listenEnterKey}
          />
          <TextField
            required
            data-cy='password-confirmation'
            label={t('reusable:plch.password-confirmation')}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            type='password'
            onKeyPress={listenEnterKey}
          />
        </Container>

        {errors.length > 0 && (
          <Notice data-cy='error-notice' nature='danger'>
            <Header centered level={5}>
              {t('ChangePassword:error-header')}
            </Header>
            <ul id='message-error-list'>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Notice>
        )}

        {successDisplay && (
          <Notice data-cy='success-notice' nature='success' centered>
            <Text centered>{t('ChangePassword:success-msg')}</Text>
          </Notice>
        )}

        <Button data-cy='change-pass-button' disabled={loading} loading={loading} onClick={changePassword}>
          {t('ChangePassword:title')}
        </Button>
      </Whitebox>
    </ContentWrapper>
  );
};

export default ChangePassword;
