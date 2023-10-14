import React, { useState } from 'react';
import LOCATION_OPTIONS from '../../../Modules/locationData.json';
import { registerUser } from '../../../reduxTokenAuthConfig';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import ClientCaptcha from 'react-client-captcha';
import { Helmet } from 'react-helmet';

import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { passwordCheck } from '../../../Modules/passwordCheck';
import { formValidation } from '../../../Modules/formValidation';
import useCurrentScope from '../../../hooks/useCurrentScope';
import Spinner from '../../../common/Spinner';
import {
  Dropdown,
  TextField,
  Header,
  Whitebox,
  Toggle,
  Text,
  InlineLink,
  Notice,
  Button,
  Container,
  ContentWrapper,
} from '../../../UI-Components';
import { FlexWrapper } from './styles';

const SignUp = (props) => {
  const { t, ready } = useTranslation('SignUp');
  const { locale } = useCurrentScope();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validator = formValidation({
    fields: [
      {
        condition: window.navigator.onLine === false,
        error: 'reusable:errors:window-navigator',
      },
      {
        condition: termsAccepted === false,
        error: 'SignUp:terms-error',
      },
      {
        condition: userCaptcha !== captcha,
        error: 'reusable:errors:captcha',
      },
      {
        condition: passwordCheck(password) === false,
        error: 'SignUp:password-reg-ex',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  const createUser = () => {
    setLoading(true);
    const { history, registerUser } = props;
    const url = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SIGNUP : 'http://localhost:3000/login';

    registerUser({ email, password, passwordConfirmation, location, nickname, url, locale, locale })
      .then(() => {
        setErrors([]);
        history.push('/signup-success');
      })
      .catch((error) => {
        if (error.response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (error.response.status === 500) {
          setErrors(['reusable:errors:500']);
          setLoading(false);
        } else {
          setErrors(error.response.data.errors.full_messages);
          setLoading(false);
        }
      });
  };

  if (props.history.action === 'POP') {
    props.history.push({ pathname: '/' });
  }

  if (!ready) {
    return <Spinner page />;
  }

  return (
    <ContentWrapper>
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

      <Header level={1} color='primary' centered>
        {t('SignUp:title')}
      </Header>

      <Whitebox>
        <TextField
          required
          data-cy='email'
          label={t('reusable:plch.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => {
            e.key === 'Enter' && createUser();
          }}
        />
        <TextField
          required
          data-cy='password'
          type='password'
          label={t('reusable:plch.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            e.key === 'Enter' && createUser();
          }}
        />
        <TextField
          required
          data-cy='password-confirmation'
          type='password'
          label={t('reusable:plch.password-confirmation')}
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          onKeyPress={(e) => {
            e.key === 'Enter' && createUser();
          }}
        />
        <TextField
          required
          data-cy='nickname'
          label={t('SignUp:nickname-plch')}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyPress={(e) => {
            e.key === 'Enter' && createUser();
          }}
        />

        <Dropdown
          space={6}
          id='location'
          data={LOCATION_OPTIONS}
          onChange={(val) => setLocation(val)}
          label={t('SignUp:location-plch')}
        />

        <Container>
          <ClientCaptcha
            captchaCode={(code) => setCaptcha(code)}
            fontFamily='bodoni'
            fontColor='#c90c61'
            charsCount={6}
            backgroundColor='#e8e8e8'
            width={130}
          />
        </Container>

        <TextField
          autoComplete='off'
          required
          space={6}
          data-cy='captcha'
          label={t('SignUp:captcha-label')}
          value={userCaptcha}
          onChange={(e) => setUserCaptcha(e.target.value)}
          onKeyPress={(e) => {
            e.key === 'Enter' && createUser();
          }}
        />

        <FlexWrapper space={6}>
          <Toggle checked={termsAccepted} onClick={() => setTermsAccepted(!termsAccepted)} data-cy='tnc-toggle' />
          <Text tint={termsAccepted ? 100 : 60}>
            <Trans i18nKey='SignUp:terms-label'>
              I accept the
              <InlineLink as={Link} to='legal' target='_blank' color='info'>
                Terms & Conditions
              </InlineLink>
            </Trans>
          </Text>
        </FlexWrapper>

        {errors.length > 0 && (
          <Notice nature='danger' data-cy='signup-errors'>
            <Header level={5} centered>
              {t('SignUp:error-header')}
            </Header>
            <ul id='message-error-list'>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Notice>
        )}

        <Button
          data-cy='signup-button'
          onClick={() => validator.onSubmit(createUser)}
          loading={loading}
          disabled={loading}
        >
          {t('SignUp:title')}
        </Button>
      </Whitebox>
    </ContentWrapper>
  );
};

export default connect(null, { registerUser })(SignUp);
