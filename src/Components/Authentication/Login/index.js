import React, { useState } from 'react';
import { connect } from 'react-redux';
import { signInUser } from '../../../reduxTokenAuthConfig';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Spinner from '../../ReusableComponents/Spinner';
import { Header, InlineLink, Text, TextField, Whitebox, Button, Notice } from '../../../UI-Components';
//MIGRATED
const Login = (props) => {
  const { t, ready } = useTranslation('Login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successDisplay, setSuccessDisplay] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const logInUser = () => {
    setLoading(true);
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrors(t('reusable:errors:window-navigator'));
    } else {
      const locale = detectLanguage();
      const { history, signInUser } = props;
      signInUser({ email, password, locale })
        .then(() => {
          setSuccessDisplay(true);
          setErrors([]);
          if (history === undefined) {
            window.location.reload();
          } else if (history.length <= 2) {
            history.push('/');
          } else {
            history.go(-1);
          }
        })
        .catch((error) => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (error.response.status === 500) {
            setLoading(false);
            setErrors(t('reusable:errors:500'));
          } else {
            setLoading(false);
            setErrors(error.response.data.errors[0]);
          }
        });
    }
  };

  if (!ready) return <Spinner />;

  return (
    <>
      <Header level={1} color='primary' centered>
        {t('Login:title')}
      </Header>
      <Whitebox>
        <TextField
          required
          id='email'
          label={t('reusable:plch.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => {
            e.key === 'Enter' && logInUser();
          }}
        />
        <TextField
          space={2}
          required
          id='password'
          type='password'
          label={t('reusable:plch.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            e.key === 'Enter' && logInUser();
          }}
        />
        <Text right size='sm' space={6}>
          <InlineLink as={Link} to='password-reset' color='neutral' discreet disabled={successDisplay}>
            {t('Login:forgot-link')}
          </InlineLink>
        </Text>

        {errors.length > 0 && (
          <Notice nature='danger'>
            <Text>{errors}</Text>
          </Notice>
        )}
        {successDisplay && (
          <Notice nature='success'>
            <Text>{t('Login:success-msg')}</Text>
          </Notice>
        )}

        <Button id='log-in-button' disabled={loading} loading={loading} onClick={() => logInUser()} space={8}>
          {t('Login:title')}
        </Button>
        <Text centered space={1}>
          {t('Login:no-acc')}
        </Text>
        <Text centered>
          <InlineLink as={Link} to='sign-up' id='create-account' disabled={successDisplay}>
            {t('Login:signup-link')}
          </InlineLink>
        </Text>
      </Whitebox>
    </>
  );
};

export default connect(null, { signInUser })(Login);
