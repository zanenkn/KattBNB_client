import React, { useState } from 'react';
import { connect } from 'react-redux';
import { signInUser } from '../../../reduxTokenAuthConfig';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Spinner from '../../ReusableComponents/Spinner';
import { Header, InlineLink, Text, TextField, Whitebox, Button, Notice, ContentWrapper } from '../../../UI-Components';
// Completely MIGRATED

const Login = (props) => {
  const { t, ready } = useTranslation('Login');
  const locale = detectLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successDisplay, setSuccessDisplay] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const logInUser = () => {
    if (window.navigator.onLine === false) {
      return setErrors(t('reusable:errors:window-navigator'));
    }

    setLoading(true);
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
  };

  if (!ready) {
    return <Spinner />;
  }

  return (
    <ContentWrapper>
      <Header level={1} color='primary' centered>
        {t('Login:title')}
      </Header>

      <Whitebox data-cy="login-form">
        <TextField
          required
          data-cy='email'
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
          data-cy='password'
          type='password'
          label={t('reusable:plch.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            e.key === 'Enter' && logInUser();
          }}
        />

        <Text right size='sm' space={6}>
          <InlineLink as={Link} to='password-reset' color='info' disabled={successDisplay}>
            {t('Login:forgot-link')}
          </InlineLink>
        </Text>

        {errors.length > 0 && (
          <Notice nature='danger' data-cy='login-errors'>
            <Text>{errors}</Text>
          </Notice>
        )}

        {successDisplay && (
          <Notice nature='success'>
            <Text>{t('Login:success-msg')}</Text>
          </Notice>
        )}

        <Button data-cy='log-in-button' disabled={loading} loading={loading} onClick={() => logInUser()} space={8}>
          {t('Login:title')}
        </Button>

        <Text centered space={1}>
          {t('Login:no-acc')}
        </Text>

        <Text centered>
          <InlineLink as={Link} to='sign-up' id='create-account' color='primary' disabled={successDisplay}>
            {t('Login:signup-link')}
          </InlineLink>
        </Text>
      </Whitebox>
    </ContentWrapper>
  );
};

export default connect(null, { signInUser })(Login);
