import React, { Component } from 'react'
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { signInUser } from '../../reduxTokenAuthConfig'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

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

    const { t } = this.props
    let errorDisplay, successDisplay, notRegisteredLinks, forgotPassword

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative style={{ 'textAlign': 'center' }} >
          {this.state.errors}
        </Message>
      )
    }

    if (this.state.successDisplay) {
      successDisplay = (
        <Message success style={{ 'textAlign': 'center' }} >
          {t('Login.success-msg')}
        </Message>
      )

    } else {
      notRegisteredLinks = (
        <p style={{ 'textAlign': 'center', 'marginTop': '2rem' }}>
          {t('Login.no-acc')}
          <br></br>
          <Header as={Link} to='sign-up' className='fake-link'>
            {t('Login.signup-link')}
          </Header>
        </p>
      )

      forgotPassword = (
        <div style={{ 'textAlign': 'right' }}>
          <Header id='password-reset-link' as={Link} to='password-reset' className='fake-link-underlined' >
            {t('Login.forgot-link')}
          </Header>
        </div>
      )
    }

    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('Login.title')}
        </Header>
        <Segment className='whitebox'>
          <Form id='login-form'>
            <Form.Input
              required
              id='email'
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder={t('reusable-placeholders.email')}
              onKeyPress={this.listenEnterKey}
            />
            <Form.Input
              required
              id='password'
              type='password'
              value={this.state.password}
              onChange={this.onChangeHandler}
              placeholder={t('reusable-placeholders.password')}
              onKeyPress={this.listenEnterKey}
            />
            {forgotPassword}
          </Form>
          {errorDisplay}
          {successDisplay}
          <Button className='submit-button' id='log-in-button' loading={this.state.loading ? true : false} onClick={this.logInUser}>
            {t('Login.title')}
          </Button>
          {notRegisteredLinks}
        </Segment>
      </div>
    )
  }
}

export default withTranslation()(connect(null, { signInUser })(Login))
