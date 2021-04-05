import React, { useState } from 'react';
import { Header, Message, Form, TextArea, Button, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import ClientCaptcha from 'react-client-captcha';
import Spinner from '../ReusableComponents/Spinner';
import FacebookIcon from '../Icons/FacebookIcon';
import InstagramIcon from '../Icons/InstagramIcon';
import LinkedinIcon from '../Icons/LinkedinIcon';

const ContactUs = (props) => {
  const { t, ready } = useTranslation('ContactUs');

  const [errors, setErrors] = useState([]);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');

  const sendMessage = async () => {
    setLoading(true);
    setErrors([]);
    setErrorDisplay(false);
    if (window.navigator.onLine === false) {
      setErrorDisplay(true);
      setErrors(['reusable:errors:window-navigator']);
      setLoading(false);
    } else {
      try {
        if (name === '' || email === '' || message === '') {
          setErrorDisplay(true);
          setErrors(['ContactUs:error-msg-fields']);
          setLoading(false);
        } else if (message.length > 1000) {
          setErrorDisplay(true);
          setErrors(['ContactUs:error-msg-length']);
          setLoading(false);
        } else if (userCaptcha !== captcha) {
          setErrorDisplay(true);
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
          setErrorDisplay(true);
          setErrors([response.data.error]);
          setLoading(false);
        }
      }
    }
  };

  if (ready) {
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
        <div className='content-wrapper' style={{ marginBottom: '0', paddingBottom: '0' }}>
          <Header as='h1'>{t('reusable:title.contact')}</Header>
          <Segment className='whitebox'>
            <Form name='contact-us'>
              <>
                <p style={{ textAlign: 'center' }}>{t('ContactUs:contact-p')}</p>
                <Form.Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('ContactUs:name-placeholder')}
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
                {errorDisplay && (
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
          </Segment>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <a
              href='https://www.facebook.com/kattbnb/'
              target='_blank'
              rel='noopener noreferrer'
              style={{ margin: '0 0.5rem', cursor: 'pointer' }}
            >
              <FacebookIcon height={'2rem'} fill={'silver'} />
            </a>
            <a
              href='https://www.instagram.com/kattbnb'
              target='_blank'
              rel='noopener noreferrer'
              style={{ margin: '0 0.5rem', cursor: 'pointer' }}
            >
              <InstagramIcon height={'2rem'} fill={'silver'} />
            </a>
            <a
              href='https://www.linkedin.com/company/28767809'
              target='_blank'
              rel='noopener noreferrer'
              style={{ margin: '0 0.5rem', cursor: 'pointer' }}
            >
              <LinkedinIcon height={'2rem'} fill={'silver'} />
            </a>
          </div>
        </div>
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default ContactUs;
