import React, { Component } from 'react';
import { Header, Message, Form, TextArea, Button, Segment } from 'semantic-ui-react';
import NetlifyForm from 'react-netlify-form';
import { withTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';
import { Helmet } from 'react-helmet';
import FacebookIcon from '../Icons/FacebookIcon';
import InstagramIcon from '../Icons/InstagramIcon';
import LinkedinIcon from '../Icons/LinkedinIcon';

class ContactUs extends Component {
  render() {
    const { t } = this.props;

    if (this.props.tReady) {
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
              <Form>
                <NetlifyForm name='contact-us'>
                  {({ error, success }) => (
                    <>
                      {error && (
                        <Message negative style={{ textAlign: 'center' }}>
                          {t('ContactUs:error-msg')}
                        </Message>
                      )}
                      {!success && (
                        <>
                          <p style={{ textAlign: 'center' }}>{t('ContactUs:contact-p')}</p>
                          <Form.Input
                            as='input'
                            type='text'
                            required
                            name='name'
                            placeholder={t('ContactUs:name-placeholder')}
                            style={{ marginBottom: '1rem' }}
                          />
                          <Form.Input
                            as='input'
                            type='email'
                            required
                            name='email'
                            placeholder={t('ContactUs:email-placeholder')}
                            style={{ marginBottom: '1rem' }}
                          />
                          <TextArea
                            as='textarea'
                            required
                            name='message'
                            placeholder={t('ContactUs:message-placeholder')}
                          />
                          <Button className='submit-button'>{t('ContactUs:send-btn')} </Button>
                        </>
                      )}
                      {success && <p style={{ textAlign: 'center' }}>{t('ContactUs:thankyou-msg')}</p>}
                    </>
                  )}
                </NetlifyForm>
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
  }
}
export default withTranslation('ContactUs')(ContactUs);
