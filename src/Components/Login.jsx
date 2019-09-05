import React, { Component } from 'react'
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { signInUser } from '../reduxTokenAuthConfig'
import { Link } from 'react-router-dom'

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: '',
    errorDisplay: false,
    successDisplay: false,
    loading: false
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  logInUser = (e) => {
    this.setState({ loading: true })
    e.preventDefault()
    const { history, signInUser } = this.props
    const {
      email,
      password
    } = this.state
    signInUser({ email, password })
      .then(() => {
        this.setState({
          successDisplay: true,
          errorDisplay: false
        })
        setTimeout(function () { history.push('/') }, 1000)
      }).catch(error => {
        this.setState({
          errorDisplay: true,
          errors: error.response.data.errors[0],
          loading: false
        })
      })
  }

  listenEnterKey = (event) => {
    if (event.key === "Enter") {
      this.logInUser(event)
    }
  }

  render() {
    let errorDisplay
    let successDisplay
    let submitButton

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative textAlign='center'>
          {this.state.errors}
        </Message>
      )
    }

    if (this.state.successDisplay) {
      successDisplay = (
        <Message success textAlign='center'>
          You have succesfully logged in! Please wait to be redirected.
        </Message>
      )
    }

    if (this.state.loading) {
      submitButton = (
        <Button className='submit-button' id='log-in-button' loading>Log in</Button>
      )
    } else {
      submitButton = (
        <Button className='submit-button' id='log-in-button' onClick={this.logInUser}>Log in</Button>
      )
    }

    return (
      <div className='content-wrapper' >

        <Header as='h1'>
          Log in
        </Header>

        <Segment className='whitebox'>

          <Form id='login-form'>
            <Form.Input
              required
              id='email'
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder='Email'
              onKeyPress={this.listenEnterKey}
            />
            <Form.Input
              required
              id='password'
              type='password'
              value={this.state.password}
              onChange={this.onChangeHandler}
              placeholder='Password'
              onKeyPress={this.listenEnterKey}
            />
            <div style={{ 'textAlign': 'right' }}>
              <Header id='password-reset-link' as={Link} to='password-reset' className='fake-link-underlined' >
                Forgot your password?
              </Header>
            </div>

          </Form>

          {errorDisplay}
          {successDisplay}

          {submitButton}

          <p style={{ 'textAlign': 'center', 'marginTop': '2rem' }}>
            Not registered?
          <br></br>
            <Header as={Link} to='sign-up' className='fake-link'>
              Create an account!
            </Header>
          </p>

        </Segment>

      </div>
    )
  }
}

export default connect(
  null,
  { signInUser },
)(Login)
