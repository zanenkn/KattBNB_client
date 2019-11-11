import React, { Component } from 'react'
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import axios from 'axios'
import queryString from 'query-string'

class ChangePassword extends Component {

  state = {
    errors: '',
    errorDisplay: false,
    successDisplay: false,
    loading: false,
    password: '',
    passwordConfirmation: ''
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  changePassword = (e) => {
    e.preventDefault()
    if (this.state.password === this.state.passwordConfirmation && this.state.password.length >= 6 && this.props.location.search.length > 150) {
      this.setState({ loading: true })
      const path = '/api/v1/auth/password'
      const payload = {
        password: this.state.password,
        password_confirmation: this.state.passwordConfirmation,
        uid: queryString.parse(this.props.location.search).uid,
        'access-token': queryString.parse(this.props.location.search).token,
        client: queryString.parse(this.props.location.search).client
      }
      axios.put(path, payload)
        .then(() => {
          this.setState({
            successDisplay: true,
            errorDisplay: false
          })
          setTimeout(function () { window.location.replace('/') }, 2000)
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    } else if (this.state.password === this.state.passwordConfirmation && this.state.password.length >= 6 && this.props.location.search.length < 150) {
      this.setState({
        errors: ["You should first visit the login page and click on the 'Forgot your password?' link"],
        errorDisplay: true
      })
    } else {
      this.setState({
        errors: ['Check that both fields are an exact match with each other and that they consist of at least 6 characters'],
        errorDisplay: true
      })
    }
  }

  listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      this.changePassword(event)
    }
  }

  render() {
    let errorDisplay, successDisplay, submitButton

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>Password change could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.successDisplay) {
      successDisplay = (
        <Message success textAlign='center'>
          You have succesfully changed your password! Please wait to be redirected.
        </Message>
      )
    }

    if (this.state.loading) {
      submitButton = (
        <Button className='submit-button' id='change-pass-button' loading>Change Password</Button>
      )
    } else {
      submitButton = (
        <Button className='submit-button' id='change-pass-button' onClick={this.changePassword}>Change Password</Button>
      )
    }

    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          Change password
        </Header>
        <Segment className='whitebox'>
          <p style={{ 'textAlign': 'center' }}>
            Type in your new password twice in the fields below. Minimum requirement is 6 characters.
          </p>
          <Form>
            <Form.Input
              required
              id='password'
              value={this.state.password}
              onChange={this.onChangeHandler}
              placeholder='Password'
              type='password'
              onKeyPress={this.listenEnterKey}
            />
            <Form.Input
              required
              id='passwordConfirmation'
              value={this.state.passwordConfirmation}
              onChange={this.onChangeHandler}
              placeholder='Repeat password'
              type='password'
              onKeyPress={this.listenEnterKey}
            />
          </Form>
          {errorDisplay}
          {successDisplay}
          {submitButton}
        </Segment>
      </div>
    )
  }
}

export default ChangePassword
