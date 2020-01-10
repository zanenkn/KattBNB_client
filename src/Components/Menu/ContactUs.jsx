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
          {t('reusable:title.contact')}
        </Header>
        <Segment className='whitebox'>
          <Form>
            <NetlifyForm name='contact-us'>
              {({ error, success }) => (
                <>
                  {error &&
                    <Message negative style={{ 'textAlign': 'center' }}>
                      {t('ContactUs:error-msg')}
                    </Message>
                  }
                  {!success &&
                    <>
                      <p style={{ 'textAlign': 'center' }}>{t('ContactUs:contact-p')}</p>
                      <Form.Input
                        as='input'
                        type='text'
                        required
                        name='name'
                        placeholder={t('ContactUs:name-placeholder')}
                        style={{ 'marginBottom': '1rem' }}
                      />
                      <Form.Input
                        as='input'
                        type='email'
                        required
                        name='email'
                        placeholder={t('ContactUs:email-placeholder')}
                        style={{ 'marginBottom': '1rem' }}
                      />
                      <TextArea
                        as='textarea'
                        required
                        name='message'
                        placeholder={t('ContactUs:message-placeholder')}
                      />
                      <Button className='submit-button'>{t('ContactUs:send-btn')} </Button>
                    </>
                  }
                  {success &&
                    <p style={{ 'textAlign': 'center' }}>
                      {t('ContactUs:thankyou-msg')}
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
