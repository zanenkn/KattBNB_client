import React, { Component } from 'react'
import { Form, Button, Message, Divider, Popup } from 'semantic-ui-react'
import axios from 'axios'
import { withTranslation } from 'react-i18next'
import PasswordStrengthBar from 'react-password-strength-bar'

class PasswordUpdateForm extends Component {

  state = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
    loading: false,
    errorDisplay: false,
    errors: '',
  }

  listenEnterKeyPassword = (event) => {
    if (event.key === 'Enter') {
      this.updatePassword(event)
    }
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  updatePassword = (e) => {
    const { t } = this.props
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else if (this.state.newPassword === this.state.newPasswordConfirmation && this.state.newPassword.length >= 6) {
      this.setState({ loading: true })
      e.preventDefault()
      const path = '/api/v1/auth/password'
      const payload = {
        current_password: this.state.currentPassword,
        password: this.state.newPassword,
        password_confirmation: this.state.newPasswordConfirmation
      }
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            displayPasswordForm: false,
            errorDisplay: false
          })
          window.alert(t('PasswordUpdateForm:success-alert'))
          window.location.replace('/login')
          window.localStorage.clear()
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    } else {
      this.setState({
        errorDisplay: true,
        errors: ['PasswordUpdateForm:error']
      })
    }
  }

  render() {
    const { t } = this.props

    if (this.props.tReady) {
      let errorDisplay
      if (this.state.errorDisplay) {
        errorDisplay = (
          <Message negative style={{ 'width': 'inherit' }} >
            <Message.Header style={{ 'textAlign': 'center' }} >{t('reusable:errors.action-error-header')}</Message.Header>
            <ul id='message-error-list'>
              {this.state.errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )
      }

      return (
        <>
          <Divider />
          <Form style={{ 'maxWidth': '194px', 'margin': 'auto' }}>
            <Form.Input
              required
              id='currentPassword'
              value={this.state.currentPassword}
              type='password'
              onChange={this.onChangeHandler}
              placeholder={t('PasswordUpdateForm:plch.current-pass')}
              onKeyPress={this.listenEnterKeyPassword}
            />
            <Popup
              trigger={
                <Form.Input
                  required
                  id='newPassword'
                  value={this.state.newPassword}
                  type='password'
                  onChange={this.onChangeHandler}
                  placeholder={t('PasswordUpdateForm:plch.new-pass')}
                  onKeyPress={this.listenEnterKeyPassword}
                />
              }
              header={t('reusable:plch.pass-strength-bar-popup-header')}
              content={
                <PasswordStrengthBar
                  password={this.state.newPassword}
                  minLength={6}
                  scoreWords={[t('reusable:plch.weak'), t('reusable:plch.weak'), t('reusable:plch.okay'), t('reusable:plch.good'), t('reusable:plch.strong')]}
                  shortScoreWord={t('reusable:plch.pass-strength-bar')}
                />
              }
              on='focus'
            />
            <Form.Input
              required
              id='newPasswordConfirmation'
              value={this.state.newPasswordConfirmation}
              type='password'
              onChange={this.onChangeHandler}
              placeholder={t('PasswordUpdateForm:plch.new-pass-confirm')}
              onKeyPress={this.listenEnterKeyPassword}
            />
            <p className='small-centered-paragraph' style={{ 'marginBottom': '0' }}>
              {t('PasswordUpdateForm:info')}
            </p>
            {errorDisplay}
          </Form>
          <div className='button-wrapper'>
            <Button secondary className='cancel-button' onClick={this.props.closeLocationAndPasswordForms}>{t('reusable:cta.close')}</Button>
            <Button id='password-submit-button' className='submit-button' disabled={this.state.loading} loading={this.state.loading ? true : false} onClick={this.updatePassword}>{t('reusable:cta.change')}</Button>
          </div>
          <Divider style={{ 'marginBottom': '2rem' }} />
        </>
      )
    } else { return null }
  }
}

export default withTranslation('PasswordUpdateForm')(PasswordUpdateForm)
