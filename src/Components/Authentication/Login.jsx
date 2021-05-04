import React, { useState } from 'react';
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { signInUser } from '../../reduxTokenAuthConfig';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';

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

  if (ready) {
    return (
      <div className='content-wrapper'>
        <Header as='h1'>{t('Login:title')}</Header>
        <Segment className='whitebox'>
          <Form id='login-form'>
            <Form.Input
              required
              id='email'
              label={t('reusable:plch.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('reusable:plch.email')}
              onKeyPress={(e) => {
                e.key === 'Enter' && logInUser();
              }}
            />
            <Form.Input
              required
              id='password'
              type='password'
              label={t('reusable:plch.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('reusable:plch.password')}
              onKeyPress={(e) => {
                e.key === 'Enter' && logInUser();
              }}
            />
            {successDisplay === false && (
              <div style={{ textAlign: 'right' }}>
                <Header id='password-reset-link' as={Link} to='password-reset' className='fake-link-underlined'>
                  {t('Login:forgot-link')}
                </Header>
              </div>
            )}
          </Form>
          {errors.length > 0 && (
            <Message negative style={{ textAlign: 'center' }}>
              {errors}
            </Message>
          )}
          {successDisplay && (
            <Message success style={{ textAlign: 'center' }}>
              {t('Login:success-msg')}
            </Message>
          )}
          <Button
            className='submit-button'
            id='log-in-button'
            disabled={loading}
            loading={loading}
            onClick={() => logInUser()}
          >
            {t('Login:title')}
          </Button>
          {successDisplay === false && (
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              {t('Login:no-acc')}
              <br></br>
              <Header as={Link} to='sign-up' className='fake-link' id='create-account'>
                {t('Login:signup-link')}
              </Header>
            </p>
          )}
        </Segment>
      </div>
    );
  } else {
    return <Spinner />;
  }
};

export default connect(null, { signInUser })(Login);
