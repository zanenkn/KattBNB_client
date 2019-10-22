import React, { Component } from 'react'
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import axios from 'axios'


class PasswordReset extends Component {

  state = {
    email: '',
    errors: '',
    errorDisplay: false,
    loading: false,
    url: 'https://kattbnb.netlify.com/change-password'
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  resetPassword = (e) => {
    this.setState({ loading: true })
    e.preventDefault()
    const path = '/api/v1/auth/password'
    const payload = {
      redirect_url: this.state.url,
      email: this.state.email
    }
    axios.post(path, payload)
      .then(() => {
        this.setState({ errorDisplay: false })
        window.location.replace('/password-reset-success')
      })
      .catch(error => {
        this.setState({
          loading: false,
          errorDisplay: true,
          errors: error.response.data.errors
        })
      })
  }

  listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      this.resetPassword(event)
    }
  }

  render() {
    let errorDisplay, submitButton

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>Password reset could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
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
      <div className='content-wrapper' >
        <Header as='h1'>
          Request password reset
        </Header>
        <Segment className='whitebox'>
          <p style={{ 'textAlign': 'center' }}>
            Fill in the email you registered with.
          </p>
          <Form>
            <Form.Input
              required
              id='email'
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder='Email'
              onKeyPress={this.listenEnterKey}
            />
          </Form>
          {errorDisplay}
          {submitButton}
        </Segment>
      </div>
    )
  }
}

export default PasswordReset
