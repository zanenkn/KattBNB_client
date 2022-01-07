import React, { useState } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { formValidation, conditions as validate } from '../../Modules/formValidation';

import Spinner from '../../common/Spinner';

import { Divider, TextField, Text, Notice, Button } from '../../UI-Components';
import { ButtonWrapper } from './styles';

const PasswordUpdateForm = ({ closeLocationAndPasswordForms }) => {
  const { t, ready } = useTranslation('PasswordUpdateForm');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const validator = formValidation({
    fields: [
      {
        condition: window.navigator.onLine === false,
        error: 'reusable:errors:window-navigator',
      },
      {
        condition: validate.nonEmptyString(currentPassword),
        error: 'PasswordUpdateForm:errors.empty-password',
      },
      {
        condition: validate.validPassword(newPassword),
        error: 'PasswordUpdateForm:errors.invalid-new-password',
      },
      {
        condition: newPassword !== newPasswordConfirmation,
        error: 'PasswordUpdateForm:errors.non-match-passwords',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  const updatePassword = () => {
    setLoading(true);
    const lang = detectLanguage();
    const path = '/api/v1/auth/password';
    const payload = {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPasswordConfirmation,
      locale: lang,
    };
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    axios
      .put(path, payload, { headers: headers })
      .then(() => {
        setErrors([]);
        window.alert(t('PasswordUpdateForm:success-alert'));
        wipeCredentials('/login');
      })
      .catch(({ response }) => {
        setLoading(false);
        if (response === undefined) {
          setErrors(['reusable:errors:unknown']);
        } else if (response.status === 500) {
          setErrors(['reusable:errors:500']);
        } else if (response.status === 401 || response.status === 404) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors([...response.data.errors.full_messages]);
        }
      });
  };

  if (!ready) {
    return <Spinner />;
  }

  return (
    <>
      <Divider bottom={5} />
      <TextField
        required
        id='currentPassword'
        value={currentPassword}
        type='password'
        onChange={(e) => setCurrentPassword(e.target.value)}
        label={t('PasswordUpdateForm:plch.current-pass')}
        onKeyPress={(e) => e.key === 'Enter' && validator.onSubmit(updatePassword)}
        autocomplete='off'
      />
      <TextField
        required
        id='newPassword'
        value={newPassword}
        type='password'
        onChange={(e) => setNewPassword(e.target.value)}
        label={t('PasswordUpdateForm:plch.new-pass')}
        onKeyPress={(e) => e.key === 'Enter' && validator.onSubmit(updatePassword)}
        autocomplete='new-password'
      />
      <TextField
        required
        id='newPasswordConfirmation'
        value={newPasswordConfirmation}
        type='password'
        onChange={(e) => setNewPasswordConfirmation(e.target.value)}
        label={t('PasswordUpdateForm:plch.new-pass-confirm')}
        onKeyPress={(e) => e.key === 'Enter' && validator.onSubmit(updatePassword)}
        autocomplete='off'
      />
      <Text centered>{t('PasswordUpdateForm:info')}</Text>

      {!!errors.length && (
        <Notice nature='danger'>
          <ul>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      )}

      <ButtonWrapper>
        <Button secondary color='neutral' onClick={() => closeLocationAndPasswordForms()}>
          {t('reusable:cta.cancel')}
        </Button>
        <Button
          id='password-submit-button'
          color='info'
          disabled={loading}
          loading={loading}
          onClick={() => validator.onSubmit(updatePassword)}
        >
          {t('reusable:cta.save')}
        </Button>
      </ButtonWrapper>
      <Divider top={5} bottom={6} />
    </>
  );
};

export default PasswordUpdateForm;
