import React, { Component } from 'react'
import { Header, Message, Form, TextArea, Button, Segment } from 'semantic-ui-react'
import NetlifyForm from 'react-netlify-form'

class ContactUs extends Component {
  render() {
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          Contact us
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
                      <p style={{ 'textAlign': 'center' }}>Fill in this form to send us a message. We will get back to you as soon as we read it!</p>

                      <Form.Input
                        as='input'
                        type='text'
                        required
                        name='name'
                        placeholder='Your name'
                        style={{ 'marginBottom': '1rem' }}
                      />

                      <Form.Input
                        as='input'
                        type='email'
                        required
                        name='email'
                        placeholder='Your email address'
                        style={{ 'marginBottom': '1rem' }}
                      />
                      <TextArea
                        as='textarea'
                        required
                        name='message'
                        placeholder='Your message'
                      />

                      <Button className='submit-button'>Send</Button>
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

export default ContactUs
