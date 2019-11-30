import React, { Component } from 'react'
import { Header, Message, Form, TextArea, Button, Segment } from 'semantic-ui-react'
import NetlifyForm from 'react-netlify-form'
import { withTranslation } from 'react-i18next'

class ContactUs extends Component {

  render() {
    const { t } = this.props
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('menu.contact')}
        </Header>
        <Segment className='whitebox'>
          <Form>
            <NetlifyForm name='contact-us'>
              {({ error, success }) => (
                <>
                  {error &&
                    <Message negative style={{ 'textAlign': 'center' }}>
                      Your information was not sent. Please try again later.
                    </Message>
                  }
                  {!success &&
                    <>
                      <p style={{ 'textAlign': 'center' }}>{t('contact.contact-p')}</p>
                      <Form.Input
                        as='input'
                        type='text'
                        required
                        name='name'
                        placeholder={t('contact.name-placeholder')}
                        style={{ 'marginBottom': '1rem' }}
                      />
                      <Form.Input
                        as='input'
                        type='email'
                        required
                        name='email'
                        placeholder={t('contact.email-placeholder')}
                        style={{ 'marginBottom': '1rem' }}
                      />
                      <TextArea
                        as='textarea'
                        required
                        name='message'
                        placeholder={t('contact.message-placeholder')}
                      />
                      <Button className='submit-button'>{t('contact.send-btn')} </Button>
                    </>
                  }
                  {success &&
                    <p style={{ 'textAlign': 'center' }}>
                      Thank you for your message!
                    </p>
                  }
                </>
              )}
            </NetlifyForm>
          </Form>
        </Segment>
      </div>
    )
  }
}

export default withTranslation()(ContactUs)
