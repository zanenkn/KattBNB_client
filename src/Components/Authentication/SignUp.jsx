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
          <Message.Header style={{ 'textAlign': 'center' }}>{t('SignUp:error-header')}</Message.Header>
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
          {t('SignUp:title')}
        </Header>
        <Segment className='whitebox'>
          <p style={{ 'textAlign': 'center' }}>
            {t('SignUp:instructions')}
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
            <Popup
              trigger={
                <Form.Input
                  required
                  id='password'
                  type='password'
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
              placeholder={t('SignUp:nickname-plch')}
              onKeyPress={this.listenEnterKey}
            />
            <Dropdown
              clearable
              search
              selection
              style={{ 'width': '100%' }}
              placeholder={t('SignUp:location-plch')}
              options={LOCATION_OPTIONS}
              id='location'
              onChange={this.handleLocationChange}
              onKeyPress={this.listenEnterKey}
            />
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
              label={t('SignUp:captcha-label')}
              required
              id='userCaptcha'
              value={this.state.userCaptcha}
              onChange={this.onChangeHandler}
              placeholder={t('SignUp:captcha-plch')}
              onKeyPress={this.listenEnterKey}
            />
          </Form>
          {errorDisplay}
          <Button id='sign-up-button' onClick={this.createUser} loading={this.state.loading ? true : false}>
            {t('SignUp:title')}
          </Button>
        </Segment>
      </div>
    )
  }
}

export default withTranslation()(connect(null, { registerUser })(SignUp))
