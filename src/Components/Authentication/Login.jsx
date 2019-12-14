import React, { Component } from 'react'
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { signInUser } from '../../reduxTokenAuthConfig'
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
    this.setState({ [e.target.id]: e.target.value })
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
        if (history.length <= 2) {
          history.push('/')
        } else {
          history.go(-1)
        }
      }).catch(error => {
        this.setState({
          errorDisplay: true,
          errors: error.response.data.errors[0],
          loading: false
        })
      })
  }

  listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      this.logInUser(event)
    }
  }

  render() {
    let errorDisplay, successDisplay, notRegisteredLinks, forgotPassword

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
          You have succesfully logged in!
        </Message>
      )

      notRegisteredLinks = (
        <p></p>
      )

      forgotPassword = (
        <p></p>
      )
    } else {
      notRegisteredLinks = (
        <p style={{ 'textAlign': 'center', 'marginTop': '2rem' }}>
          Not registered?
          <br></br>
          <Header as={Link} to='sign-up' className='fake-link'>
            Create an account!
          </Header>
        </p>
      )

      forgotPassword = (
        <div style={{ 'textAlign': 'right' }}>
          <Header id='password-reset-link' as={Link} to='password-reset' className='fake-link-underlined' >
            Forgot your password?
          </Header>
        </div>
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
            {forgotPassword}
          </Form>
          {errorDisplay}
          {successDisplay}
          <Button className='submit-button' id='log-in-button' loading={this.state.loading ? true : false} onClick={this.logInUser}>Log in</Button>
          {notRegisteredLinks}
        </Segment>
      </div>
    )
  }
}

export default connect(null, { signInUser })(Login)
