import React, { Component } from 'react'
import { Sidebar, Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import axios from 'axios'


class PasswordReset extends Component {
  state = {
    email: '',
    errors: '',
    error_display: false,
    success_display: false,
    loading: false,
    url: 'http://localhost:3000/change-password'
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  resetPassword = (e) => {
    this.setState({ loading: true })
    e.preventDefault();
    const path = '/api/v1/auth/password'
    const payload = {
      redirect_url: this.state.url,
      email: this.state.email
    }
    axios.post(path, payload)
      .then(() => {
        this.setState({
          success_display: true,
          error_display: false
        })
      })
      .catch(error => {
        this.setState({
          loading: false,
          error_display: true,
          errors: error.response.data.errors
        })
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
        <Button className='submit-button' id='reset-pass-button' onClick={this.resetPassword}>Reset</Button>
      )
    }

    return (
      <Sidebar.Pushable className='content-wrapper' >

        <Header as='h1'>
          Request password reset
        </Header>

        <Segment className='whitebox'>

          <p style={{ 'textAlign': 'center' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          {errorDisplay}
          {successDisplay}

          <Form>
            <Form.Input
              required
              id='email'
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder='Email'
              onKeyPress={event => {
                if (event.key === "Enter") {
                  this.resetPassword(event)
                }
              }}
            />
          </Form>

          {submitButton}

        </Segment>

      </Sidebar.Pushable>

    )
  }
}

export default PasswordReset
