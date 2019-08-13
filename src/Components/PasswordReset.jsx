import React, { Component } from 'react'
import { Sidebar, Header, Segment, Form, Message, Button } from 'semantic-ui-react'

class PasswordReset extends Component {
  state = {
    email: '',
    errors: '',
    error_display: false,
    success_display: false,
    loading: false
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  render() {
    let errorDisplay
    let successDisplay
    let submitButton

    if (this.state.error_display) {
      errorDisplay = (
        <Message negative textAlign='center'>
          {this.state.errors}
        </Message>
      )
    }

    if (this.state.success_display) {
      successDisplay = (
        <Message success textAlign='center'>
          Follow instructions (blindly) sent to your email.
        </Message>
      )
    }

    if (this.state.loading) {
      submitButton = (
        <Button className='submit-button' id='reset-pass-button' loading>Reset</Button>
      )
    } else {
      submitButton = (
        <Button className='submit-button' id='reset-pass-button' onClick={this.logInUser}>Reset</Button>
      )
    }

    return (
      <Sidebar.Pushable className='content-wrapper' >

        <Header as='h1'>
          Request password reset
        </Header>

        <Segment className='whitebox'>

          <p style={{ 'textAlign': 'center'}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          {errorDisplay}
          {successDisplay}

          <Form>
            <Form.Input
              id='email'
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder='Email'
            />
          </Form>

          {submitButton}

        </Segment>

      </Sidebar.Pushable>

    )
  }
}

export default PasswordReset