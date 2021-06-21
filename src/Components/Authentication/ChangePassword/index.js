import React, { useState } from 'react';
import axios from 'axios';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { passwordCheck } from '../../../Modules/passwordCheck';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import Spinner from '../../ReusableComponents/Spinner';
import { Header, Container, Text, TextField, Whitebox, Button, Notice } from '../../../UI-Components';
// MIGRATION IN PROGRESS

const ChangePassword = ({ location: { search } }) => {
  const { t, ready } = useTranslation('ChangePassword');

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
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (password === passwordConfirmation && passwordCheck(password) && search.length > 150) {
        setLoading(true);
        const lang = detectLanguage();
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
      } else if (password === passwordConfirmation && passwordCheck(password) && search.length < 150) {
        setErrors(['ChangePassword:error-1']);
      } else {
        setErrors(['ChangePassword:error-2']);
      }
    }
  };

  if (!ready) {
    return <Spinner />;
  }

  return (
    <>
      <Header centered color='primary'>
        {t('ChangePassword:title')}
      </Header>
      <Whitebox>
        <Text centered>{t('ChangePassword:instructions')}</Text>
        <Container space={6}>
          <TextField
            required
            id='password'
            label={t('reusable:plch.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            onKeyPress={listenEnterKey}
          />
          <TextField
            required
            id='passwordConfirmation'
            label={t('reusable:plch.password-confirmation')}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            type='password'
            onKeyPress={listenEnterKey}
          />
        </Container>
        {errors.length > 0 && (
          <Notice nature='danger'>
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
          <Notice nature='success' centered>
            <Text centered>{t('ChangePassword:success-msg')}</Text>
          </Notice>
        )}
        <Button id='change-pass-button' disabled={loading} loading={loading} onClick={changePassword}>
          {t('ChangePassword:title')}
        </Button>
      </Whitebox>
    </>
  );
};

export default ChangePassword;
