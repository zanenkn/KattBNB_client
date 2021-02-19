import React, { useState } from 'react';
import axios from 'axios';
import { Header, Message, Form, TextArea, Button, Segment } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';
import { Helmet } from 'react-helmet';
import FacebookIcon from '../Icons/FacebookIcon';
import InstagramIcon from '../Icons/InstagramIcon';
import LinkedinIcon from '../Icons/LinkedinIcon';
import { useTranslation } from 'react-i18next';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';

const ContactUs = (props) => {
  const { t, ready } = useTranslation('ContactUs');

  const [errors, setErrors] = useState([]);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (window.navigator.onLine === false) {
      setErrorDisplay(true);
      setErrors(['reusable:errors:window-navigator']);
      setLoading(false);
    } else {
      try {
        const lang = detectLanguage();
        const path = `/api/v1/contactus?locale=${lang}&name=${name}&email=${email}&message=${message}`;
        const response = await axios.get(path);
        if (response.data.message === 'Success!!!') {
          window.alert('Your message was submitted successfully! We are miaowing a response :)');
          props.history.push('/search-results');
        }
        setLoading(false);
      } catch (error) {
        if (error.response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (error.response.status === 503) {
          wipeCredentials('/is-not-available?atm');
        } else {
          setErrorDisplay(true);
          setErrors([error.response.data.error]);
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
        <div className='content-wrapper' style={{ marginBottom: '0', paddingBottom: '0' }}>
          <Header as='h1'>{t('reusable:title.contact')}</Header>
          <Segment className='whitebox'>
            <Form name='contact-us'>
              <>
                {errorDisplay && (
                  <Message negative style={{ textAlign: 'center' }}>
                    {t('ContactUs:error-msg')}
                  </Message>
                )}
                <p style={{ textAlign: 'center' }}>{t('ContactUs:contact-p')}</p>
                <Form.Input
                  as='input'
                  type='text'
                  required
                  name='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('ContactUs:name-placeholder')}
                  style={{ marginBottom: '1rem' }}
                />
                <Form.Input
                  as='input'
                  type='email'
                  required
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('ContactUs:email-placeholder')}
                  style={{ marginBottom: '1rem' }}
                />
                <TextArea
                  as='textarea'
                  required
                  name='message'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('ContactUs:message-placeholder')}
                />
                <Button className='submit-button' onClick={sendMessage}>
                  {t('ContactUs:send-btn')}{' '}
                </Button>
              </>
            </Form>
          </Segment>
          <div style={{ display: 'flex', 'justify-content': 'center', marginTop: '1.5rem' }}>
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

export default withTranslation('ContactUs')(ContactUs);
