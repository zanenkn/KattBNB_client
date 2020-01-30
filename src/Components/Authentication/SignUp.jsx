import React, { Component } from 'react'
import { Header, Segment, Form, Button, Dropdown, Message, Popup, Checkbox } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../../Modules/locationData'
import { registerUser } from '../../reduxTokenAuthConfig'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import ClientCaptcha from 'react-client-captcha'
import PasswordStrengthBar from 'react-password-strength-bar'
import Spinner from '../ReusableComponents/Spinner'

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
    userCaptcha: '',
    termsAccepted: false
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
        errors: ["SignUp:You didn't input the captcha phrase correctly, please try again!"],
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
    if (event.key === 'Enter' && this.state.termsAccepted) {
      this.createUser(event)
    }
  }

  render() {
    const { t } = this.props

    if (this.props.history.action === 'POP') {
      this.props.history.push({ pathname: '/' })
    }

    if(this.props.tReady) {
      let errorDisplay
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
                label={t('reusable:plch.email')}
                value={this.state.email}
                onChange={this.onChangeHandler}
                placeholder={t('reusable:plch.email')}
                onKeyPress={this.listenEnterKey}
              />
              <Popup
                trigger={
                  <Form.Input
                    required
                    id='password'
                    type='password'
                    label={t('reusable:plch.password')}
                    value={this.state.password}
                    onChange={this.onChangeHandler}
                    placeholder={t('reusable:plch.password')}
                    onKeyPress={this.listenEnterKey}
                  />
                }
                header={t('reusable:plch.pass-strength-bar-popup-header')}
                content={
                  <PasswordStrengthBar
                    style={{ 'marginBottom': '0.5rem' }}
                    password={this.state.password}
                    minLength={6}
                    scoreWords={[t('reusable:plch.weak'), t('reusable:plch.weak'), t('reusable:plch.okay'), t('reusable:plch.good'), t('reusable:plch.strong')]}
                    shortScoreWord={t('reusable:plch.pass-strength-bar')}
                  />
                }
                on='focus'
              />
              <Form.Input
                required
                id='passwordConfirmation'
                type='password'
                label={t('reusable:plch.password-confirmation')}
                value={this.state.passwordConfirmation}
                onChange={this.onChangeHandler}
                placeholder={t('reusable:plch.password-confirmation')}
                onKeyPress={this.listenEnterKey}
              />
              <Form.Input
                required
                id='nickname'
                label={t('SignUp:nickname-plch')}
                value={this.state.username}
                onChange={this.onChangeHandler}
                placeholder={t('SignUp:nickname-plch')}
                onKeyPress={this.listenEnterKey}
              />
              <div className='required field' style={{ 'marginBottom': '1.5em' }}>
                <label>
                  {t('SignUp:location-plch')}
                </label>
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
                label={t('SignUp:captcha-label')}
                required
                id='userCaptcha'
                value={this.state.userCaptcha}
                onChange={this.onChangeHandler}
                placeholder={t('SignUp:captcha-plch')}
                onKeyPress={this.listenEnterKey}
              />
            </Form>
            <div style={{ 'display': 'inline-flex', 'paddingTop': '1em' }}>
              <Checkbox toggle onClick={() => this.setState({ termsAccepted: !this.state.termsAccepted })} />
              <label style={{ 'paddingLeft': '1.3em' }}>I accept the <Header as={Link} to='/legal' target='_blank' className='fake-link-underlined-reg'>Terms & Conditions</Header></label>
            </div>
            {errorDisplay}
            <Button id='sign-up-button' onClick={this.createUser} loading={this.state.loading ? true : false} disabled={this.state.termsAccepted ? false : true}>
              {t('SignUp:title')}
            </Button>
          </Segment>
        </div>
      )
    } else {return <Spinner/>}
  }
}

export default withTranslation('SignUp')(connect(null, { registerUser })(SignUp))
