import React, { Component } from 'react'
import { Sidebar, Header, Message, Form, TextArea, Button } from 'semantic-ui-react'
import NetlifyForm from 'react-netlify-form'

class ContactUs extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          Contact us
        </Header>

        <NetlifyForm name='contact'>
          {({ error, success }) => (
            <>
              {!success &&
                <>
                  <p>Fill in this form to send me a message. We will get back to you as soon as we read it!</p>

                  <Form id='login-form'>
                    <Form.Input
                      type='text'
                      required
                      name='name'
                      placeholder='Your name'
                    />

                    <Form.Input
                      type='email'
                      required
                      name='name'
                      placeholder='Your email address'
                    />
                    <TextArea
                      required
                      name='message'  
                      placeholder='Your message'
                    />
                  </Form>
                  <Button className='submit-button'>Send</Button>
                  {/* <div>
                    <input type='text' placeholder="Your name" name='name' required />
                    <input type='email' placeholder="Your email address" name='email' required />
                    <textarea placeholder="Your message" name='message' required />
                    <button className="button">Send</button>
                  </div> */}
                </>
              }
              {error &&
                <Message negative textAlign='center'>
                  Your information was not sent. Please try again later.
                </Message>
              }
              {success &&
                <Message success textAlign='center'>
                  Thank you for your message!
               </Message>
              }
            </>
          )}
        </NetlifyForm>

      </Sidebar.Pushable>
    )
  }
}

export default ContactUs
