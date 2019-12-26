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
          window.alert('Your password was successfully changed!')
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
        errors: ["Check that 'new password' fields are an exact match with each other and that they consist of at least 6 characters"]
      })
    }
  }

  render() {
    const { t } = this.props
    let errorDisplay

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative style={{ 'width': 'inherit' }} >
          <Message.Header style={{ 'textAlign': 'center' }} >Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    return (
      <>
        <Divider />
        <Form style={{ 'maxWidth': '194px' }}>
          <Form.Input
            required
            id='currentPassword'
            value={this.state.currentPassword}
            type='password'
            onChange={this.onChangeHandler}
            placeholder='Current password'
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
                placeholder='New password'
                onKeyPress={this.listenEnterKeyPassword}
              />
            }
            header={t('reusable-placeholders.pass-strength-bar-popup-header')}
            content={
              <PasswordStrengthBar
                password={this.state.newPassword}
                minLength={6}
                scoreWords={(navigator.language.includes('sv') === true || navigator.language.includes('SV') === true ? ['svagt', 'svagt', 'okay', 'bra', 'starkt'] : ['weak', 'weak', 'okay', 'good', 'strong'])}
                shortScoreWord={t('reusable-placeholders.pass-strength-bar')}
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
            placeholder='New password again'
            onKeyPress={this.listenEnterKeyPassword}
          />
          <p className='small-centered-paragraph' style={{ 'marginBottom': '0' }}>
            Upon successful password change you will be redirected back to login.
          </p>
          {errorDisplay}
        </Form>
        <div className='button-wrapper'>
          <Button secondary className='cancel-button' onClick={this.props.closeLocationAndPasswordForms}>Close</Button>
          <Button id='password-submit-button' className='submit-button' loading={this.state.loading ? true : false} onClick={this.updatePassword}>Change</Button>
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  }
}

export default withTranslation()(PasswordUpdateForm)
