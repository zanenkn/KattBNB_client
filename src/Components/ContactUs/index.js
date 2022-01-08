import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import ClientCaptcha from 'react-client-captcha';
import Spinner from '../../common/Spinner';
import {
  Header,
  Whitebox,
  Text,
  TextField,
  TextArea,
  Container,
  Button,
  Notice,
  ContentWrapper,
} from '../../UI-Components';
//MIGRATED
const ContactUs = (props) => {
  const { t, ready } = useTranslation('ContactUs');

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');

  const sendMessage = async () => {
    setLoading(true);
    setErrors([]);
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
      setLoading(false);
    } else {
      try {
        if (name === '' || email === '' || message === '') {
          setErrors(['ContactUs:error-msg-fields']);
          setLoading(false);
        } else if (message.length > 1000) {
          setErrors(['ContactUs:error-msg-length']);
          setLoading(false);
        } else if (userCaptcha !== captcha) {
          setErrors(['reusable:errors:captcha']);
          setLoading(false);
        } else {
          const lang = detectLanguage();
          const path = `/api/v1/contactus?locale=${lang}&name=${name}&email=${email}&message=${message}`;
          const response = await axios.get(path);
          if (response.status === 200) {
            window.alert(t('ContactUs:thankyou-msg'));
            props.history.push('/search');
          }
        }
      } catch ({ response }) {
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else {
          setErrors([response.data.error]);
          setLoading(false);
        }
      }
    }
  };

  if (!ready) return <Spinner />;

  return (
    <ContentWrapper>
      <Helmet>
        <title>KattBNB vill höra från dig!</title>
        <meta
          name='description'
          content='Vi vill bli bäst inom djurpassning! Hör av dig om du har en idé hur kan vi göra det ännu lättare för dig att hitta kattvakt!'
        />
        <link rel='canonical' href='https://kattbnb.se/contact-us' />
        <meta property='og:title' content='KattBNB vill höra från dig!' />
        <meta property='og:url' content='https://kattbnb.se/contact-us' />
        <meta property='og:type' content='website' />
        <meta
          property='og:description'
          content='Vi vill bli bäst inom djurpassning! Hör av dig om du har en idé hur kan vi göra det ännu lättare för dig att hitta kattvakt!'
        />
        <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
      </Helmet>
      {/* line below is used solely for relevant Cypress test */}
      {process.env.NODE_ENV !== 'production' && <p id='cypress-captcha'>{captcha}</p>}

      <Header level={1} color='primary' centered>
        {t('reusable:title.contact')}
      </Header>
      <Whitebox>
        <Text centered space={4}>
          {t('ContactUs:contact-p')}
        </Text>
        <TextField
          required
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          label={t('ContactUs:name-placeholder')}
          space={4}
          type='text'
        />
        <TextField
          required
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label={t('ContactUs:email-placeholder')}
          space={4}
          type='email'
        />
        <TextArea
          required
          id='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label={t('ContactUs:message-placeholder')}
          space={2}
        />
        <Text size='sm' right space={0} italic>
          {t('reusable:remaining-chars')} {1000 - message.length}
        </Text>
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
          required
          space={6}
          id='userCaptcha'
          value={userCaptcha}
          onChange={(e) => setUserCaptcha(e.target.value)}
          label={t('reusable:labels:captcha')}
          autoComplete='off'
        />
        {errors.length > 0 && (
          <Notice nature='danger'>
            <ul id='message-error-list'>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Notice>
        )}
        <Button onClick={sendMessage} loading={loading}>
          {t('ContactUs:send-btn')}
        </Button>
      </Whitebox>
    </ContentWrapper>
  );
};

export default ContactUs;
