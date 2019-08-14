import React, { Component } from 'react'
import { Sidebar, Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { signInUser } from '../reduxTokenAuthConfig'
import { Link } from 'react-router-dom'

class Login extends Component {
  state = {
    email: '',
    password: '',
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

  logInUser = (e) => {
    this.setState({ loading: true })
    e.preventDefault();
    const { history, signInUser } = this.props
    const {
      email,
      password
    } = this.state
    signInUser({ email, password })
      .then(() => {
        this.setState({ success_display: true, error_display: false })
        setTimeout(function () { history.push('/') }, 1500)
      }).catch(error => {
        this.setState({
          error_display: true,
          errors: error.response.data.errors[0],
          loading: false
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
      <Sidebar.Pushable className='content-wrapper' >

        <Header as='h1'>
          Log in
        </Header>

        <Segment className='whitebox'>

          {errorDisplay}
          {successDisplay}

          <Form id='login-form'>
            <Form.Input
              required
              id='email'
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder='Email'
            />
            <Form.Input
              required
              id='password'
              type='password'
              value={this.state.password}
              onChange={this.onChangeHandler}
              placeholder='Password'
              onKeyPress={event => {
                if (event.key === "Enter") {
                  this.logInUser(event)
                }
              }}
            />
            <Header as={Link} to='password-reset' className='fake-link'>
              Forgot your password?
            </Header>

          </Form>

          {submitButton}

          <p style={{ 'textAlign': 'center', 'marginTop': '2rem' }}>
            Not registered?
          <br></br>
            <Header as={Link} to='sign-up' className='fake-link'>
              Create an account!
            </Header>
          </p>

        </Segment>

      </Sidebar.Pushable>
    )
  }
}

export default connect(
  null,
  { signInUser },
)(Login)
