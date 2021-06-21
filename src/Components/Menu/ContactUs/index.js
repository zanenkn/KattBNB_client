import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import ClientCaptcha from 'react-client-captcha';
import Spinner from '../../ReusableComponents/Spinner';
import { Header, Whitebox, Text, TextField } from '../../../UI-Components';
import SoMeIcons from '../../ReusableComponents/SoMeIcons';
//MIGRATION IN PROGRESS
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
    <>
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
      </Whitebox>
      {/* <Segment className='whitebox'>
            <Form name='contact-us'>
              <>
                <p style={{ textAlign: 'center' }}></p>
                <Form.Input

                  style={{ marginBottom: '1rem' }}
                />
                <Form.Input
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('ContactUs:email-placeholder')}
                  style={{ marginBottom: '1rem' }}
                />
                <TextArea
                  id='message'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('ContactUs:message-placeholder')}
                />
                <p style={{ textAlign: 'end', fontSize: 'smaller', fontStyle: 'italic' }}>
                  {t('reusable:remaining-chars')} {1000 - message.length}
                </p>
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
                  id='userCaptcha'
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  placeholder={t('reusable:plch:captcha')}
                />
                {errors.length > 0 && (
                  <Message negative>
                    <ul id='message-error-list'>
                      {errors.map((error) => (
                        <li key={error}>{t(error)}</li>
                      ))}
                    </ul>
                  </Message>
                )}
                <Button className='submit-button' onClick={sendMessage} loading={loading}>
                  {t('ContactUs:send-btn')}
                </Button>
              </>
            </Form>
          </Segment> */}
      <SoMeIcons />
    </>
  );
};

export default ContactUs;
