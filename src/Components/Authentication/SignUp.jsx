import React, { Component } from 'react'
import { Header, Segment, Form, Button, Dropdown, Message } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../../Modules/locationData'
import { registerUser } from '../../reduxTokenAuthConfig'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import ClientCaptcha from 'react-client-captcha'

class SignUp extends Component {

  state = {
    email: '',
    password: '',
    passwordConfirmation: '',
    nickname: '',
    location: '',
    errors: '',
    url: 'https://kattbnb.netlify.com/login',
    errorDisplay: false,
    loading: false
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  handleLocationChange = (e, { value }) => {
    this.setState({ location: value })
  }

  createUser = (e) => {
    this.setState({ loading: true })
    e.preventDefault()
    const { history, registerUser } = this.props
    const {
      email,
      password,
      passwordConfirmation,
      location,
      nickname,
      url
    } = this.state
    registerUser({ email, password, passwordConfirmation, location, nickname, url })
      .then(() => {
        this.setState({ errorDisplay: false })
        history.push('/signup-success')
      }).catch(error => {
        this.setState({
          errors: error.response.data.errors.full_messages,
          errorDisplay: true,
          loading: false
        })
      })
  }

  listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      this.createUser(event)
    }
  }

  render() {
    const { t } = this.props
    let errorDisplay

    if (this.props.history.action === 'POP') {
      this.props.history.push({ pathname: '/' })
    }

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>{t('Signup.error-header')}</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('Signup.title')}
        </Header>
        <Segment className='whitebox'>
          <p style={{ 'textAlign': 'center' }}>
            {t('Signup.instructions')}
          </p>
          <Form id='signup-form'>
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
            <Form.Input
              required
              id='passwordConfirmation'
              type='password'
              value={this.state.passwordConfirmation}
              onChange={this.onChangeHandler}
              placeholder={t('reusable-placeholders.password-confirmation')}
              onKeyPress={this.listenEnterKey}
            />
            <Form.Input
              required
              id='nickname'
              value={this.state.username}
              onChange={this.onChangeHandler}
              placeholder={t('Signup.nickname-plch')}
              onKeyPress={this.listenEnterKey}
            />
            <Dropdown
              clearable
              search
              selection
              style={{ 'width': '100%' }}
              placeholder={t('Signup.location-plch')}
              options={LOCATION_OPTIONS}
              id='location'
              onChange={this.handleLocationChange}
              onKeyPress={this.listenEnterKey}
            />
          </Form>
          {errorDisplay}
          <Button id='sign-up-button' onClick={this.createUser} loading={this.state.loading ? true : false}>
            {t('Signup.title')}
          </Button>
          <ClientCaptcha captchaCode={code => console.log(code)} />
        </Segment>
      </div>
    )
  }
}

export default withTranslation()(connect(null, { registerUser })(SignUp))
