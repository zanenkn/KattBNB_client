import React, { Component } from 'react'
import { Header, Segment, Form, Button, Dropdown, Message, Popup } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../../Modules/locationData'
import { registerUser } from '../../reduxTokenAuthConfig'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import ClientCaptcha from 'react-client-captcha'
import PasswordStrengthBar from 'react-password-strength-bar'

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
    loading: false,
    captcha: '',
    userCaptcha: ''
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
    if (this.state.userCaptcha !== this.state.captcha) {
      this.setState({
        errors: ["You didn't input the captcha phrase correctly, please try again!"],
        errorDisplay: true,
        loading: false
      })
    } else {
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
          <Message.Header style={{ 'textAlign': 'center' }}>{t('Signup.error-header')}</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{t(error)}</li>
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
              label={t('reusable-placeholders.email')}
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder={t('reusable-placeholders.email')}
              onKeyPress={this.listenEnterKey}
            />
            <Popup
              trigger={
                <Form.Input
                  required
                  id='password'
                  type='password'
                  label={t('reusable-placeholders.password')}
                  value={this.state.password}
                  onChange={this.onChangeHandler}
                  placeholder={t('reusable-placeholders.password')}
                  onKeyPress={this.listenEnterKey}
                />
              }
              header={t('reusable-placeholders.pass-strength-bar-popup-header')}
              content={
                <PasswordStrengthBar
                  style={{ 'marginBottom': '0.5rem' }}
                  password={this.state.password}
                  minLength={6}
                  scoreWords={[t('reusable-placeholders.weak'), t('reusable-placeholders.weak'), t('reusable-placeholders.okay'), t('reusable-placeholders.good'), t('reusable-placeholders.strong')]}
                  shortScoreWord={t('reusable-placeholders.pass-strength-bar')}
                />
              }
              on='focus'
            />
            <Form.Input
              required
              id='passwordConfirmation'
              type='password'
              label={t('reusable-placeholders.password-confirmation')}
              value={this.state.passwordConfirmation}
              onChange={this.onChangeHandler}
              placeholder={t('reusable-placeholders.password-confirmation')}
              onKeyPress={this.listenEnterKey}
            />
            <Form.Input
              required
              id='nickname'
              label={t('Signup.nickname-plch')}
              value={this.state.username}
              onChange={this.onChangeHandler}
              placeholder={t('Signup.nickname-plch')}
              onKeyPress={this.listenEnterKey}
            />
            <div className='required field' style={{ 'marginBottom': '1.5em' }}>
              <label>
                {t('Signup.location-plch')}
              </label>
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
            </div>
            <div style={{ 'margin': '1em 0' }}>
              <ClientCaptcha
                captchaCode={code => this.setState({ captcha: code })}
                fontFamily='bodoni'
                fontColor='#c90c61'
                charsCount={6}
                backgroundColor='#e8e8e8'
                width={130}
              />
            </div>
            <Form.Input
              label={t('Signup.captcha-label')}
              required
              id='userCaptcha'
              value={this.state.userCaptcha}
              onChange={this.onChangeHandler}
              placeholder={t('Signup.captcha-plch')}
              onKeyPress={this.listenEnterKey}
            />
          </Form>
          {errorDisplay}
          <Button id='sign-up-button' onClick={this.createUser} loading={this.state.loading ? true : false}>
            {t('Signup.title')}
          </Button>
        </Segment>
      </div>
    )
  }
}

export default withTranslation()(connect(null, { registerUser })(SignUp))
