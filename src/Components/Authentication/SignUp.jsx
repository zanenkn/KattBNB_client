import React, { useState } from 'react';
import { Header, Segment, Form, Button, Dropdown, Message, Checkbox } from 'semantic-ui-react';
import { LOCATION_OPTIONS } from '../../Modules/locationData';
import { registerUser } from '../../reduxTokenAuthConfig';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { passwordCheck } from '../../Modules/passwordCheck';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import ClientCaptcha from 'react-client-captcha';
import Spinner from '../ReusableComponents/Spinner';
import { Helmet } from 'react-helmet';

const SignUp = (props) => {
  const { t, ready } = useTranslation('SignUp');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const createUser = () => {
    setLoading(true);
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
      setErrorDisplay(true);
      setLoading(false);
    } else {
      if (termsAccepted === false) {
        setErrors(['SignUp:terms-error']);
        setErrorDisplay(true);
        setLoading(false);
      } else if (userCaptcha !== captcha) {
        setErrors(['reusable:errors:captcha']);
        setErrorDisplay(true);
        setLoading(false);
      } else if (passwordCheck(password) === false) {
        setErrors(['reusable:errors:password-reg-ex']);
        setErrorDisplay(true);
        setLoading(false);
      } else {
        const { history, registerUser } = props;
        const langPref = detectLanguage();
        const lang = detectLanguage();
        const url =
          process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SIGNUP : 'http://localhost:3000/login';
        registerUser({ email, password, passwordConfirmation, location, nickname, url, lang, langPref })
          .then(() => {
            setErrorDisplay(false);
            history.push('/signup-success');
          })
          .catch((error) => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 500) {
              setErrors(['reusable:errors:500']);
              setErrorDisplay(true);
              setLoading(false);
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm');
            } else {
              setErrors(error.response.data.errors.full_messages);
              setErrorDisplay(true);
              setLoading(false);
            }
          });
      }
    }
  };

  if (props.history.action === 'POP') {
    props.history.push({ pathname: '/' });
  }

  if (ready) {
    return (
      <>
        <Helmet>
          <title>KattBNB - registrera konto</title>
          <meta
            name='description'
            content='Fullbokat i kattpensionat? Vi känner igen frustrationen. Registrera konto med KattBNB och hitta den perfekta kattvakten.'
          />
          <link rel='canonical' href='https://kattbnb.se/sign-up' />
          <meta property='og:title' content='KattBNB - registrera konto' />
          <meta property='og:url' content='https://kattbnb.se/sign-up' />
          <meta property='og:type' content='website' />
          <meta
            property='og:description'
            content='Fullbokat i kattpensionat? Vi känner igen frustrationen. Registrera konto med KattBNB och hitta den perfekta kattvakten.'
          />
          <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
        </Helmet>
        {/* line below is used solely for relevant Cypress test */}
        {process.env.NODE_ENV !== 'production' && <p id='cypress-captcha'>{captcha}</p>}
        <div className='content-wrapper'>
          <Header as='h1'>{t('SignUp:title')}</Header>
          <Segment className='whitebox'>
            <p style={{ textAlign: 'center' }}>{t('SignUp:instructions')}</p>
            <Form id='signup-form'>
              <Form.Input
                required
                id='email'
                label={t('reusable:plch.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('reusable:plch.email')}
                onKeyPress={(e) => {
                  e.key === 'Enter' && createUser();
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
                  e.key === 'Enter' && createUser();
                }}
              />
              <Form.Input
                required
                id='passwordConfirmation'
                type='password'
                label={t('reusable:plch.password-confirmation')}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder={t('reusable:plch.password-confirmation')}
                onKeyPress={(e) => {
                  e.key === 'Enter' && createUser();
                }}
              />
              <Form.Input
                required
                id='nickname'
                label={t('SignUp:nickname-plch')}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t('SignUp:nickname-plch')}
                onKeyPress={(e) => {
                  e.key === 'Enter' && createUser();
                }}
              />
              <div className='required field' style={{ marginBottom: '1.5em' }}>
                <label>{t('SignUp:location-plch')}</label>
                <Dropdown
                  clearable
                  search
                  selection
                  style={{ width: '100%' }}
                  placeholder={t('SignUp:location-plch')}
                  options={LOCATION_OPTIONS}
                  id='location'
                  onChange={(e, { value }) => setLocation(value)}
                  onKeyPress={(e) => {
                    e.key === 'Enter' && createUser();
                  }}
                />
              </div>
              <div style={{ margin: '1em 0' }}>
                <ClientCaptcha
                  captchaCode={(code) => setCaptcha(code)}
                  fontFamily='bodoni'
                  fontColor='#c90c61'
                  charsCount={6}
                  backgroundColor='#e8e8e8'
                  width={130}
                />
              </div>
              <Form.Input
                label={t('SignUp:captcha-label')}
                required
                id='userCaptcha'
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
                placeholder={t('reusable:plch:captcha')}
                onKeyPress={(e) => {
                  e.key === 'Enter' && createUser();
                }}
              />
            </Form>
            <div style={{ display: 'inline-flex', paddingTop: '1em' }}>
              <div className='toggle' onClick={() => setTermsAccepted(!termsAccepted)}>
                <Checkbox toggle checked={termsAccepted} />
              </div>
              <label style={{ paddingLeft: '1.3em', color: termsAccepted ? 'grey' : 'silver' }}>
                <Trans i18nKey='SignUp:terms-label'>
                  I accept the
                  <Header as={Link} to='/legal' target='_blank' className='fake-link-underlined'>
                    Terms & Conditions
                  </Header>
                </Trans>
              </label>
            </div>

            {errorDisplay && (
              <Message negative>
                <Message.Header style={{ textAlign: 'center' }}>{t('SignUp:error-header')}</Message.Header>
                <ul id='message-error-list'>
                  {errors.map((error) => (
                    <li key={error}>{t(error)}</li>
                  ))}
                </ul>
              </Message>
            )}
            <Button id='sign-up-button' onClick={() => createUser()} loading={loading} disabled={loading}>
              {t('SignUp:title')}
            </Button>
          </Segment>
        </div>
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default connect(null, { registerUser })(SignUp);
