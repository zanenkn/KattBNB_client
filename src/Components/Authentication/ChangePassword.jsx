import React, { Component } from 'react'
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import axios from 'axios'
import queryString from 'query-string'
import { withTranslation } from 'react-i18next'

class ChangePassword extends Component {

  state = {
    errors: '',
    errorDisplay: false,
    successDisplay: false,
    loading: false,
    password: '',
    passwordConfirmation: ''
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  changePassword = (e) => {
    e.preventDefault()
    if (this.state.password === this.state.passwordConfirmation && this.state.password.length >= 6 && this.props.location.search.length > 150) {
      this.setState({ loading: true })
      const path = '/api/v1/auth/password'
      const payload = {
        password: this.state.password,
        password_confirmation: this.state.passwordConfirmation,
        uid: queryString.parse(this.props.location.search).uid,
        'access-token': queryString.parse(this.props.location.search).token,
        client: queryString.parse(this.props.location.search).client
      }
      axios.put(path, payload)
        .then(() => {
          this.setState({
            successDisplay: true,
            errorDisplay: false
          })
          setTimeout(function () { window.location.replace('/login') }, 2000)
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    } else if (this.state.password === this.state.passwordConfirmation && this.state.password.length >= 6 && this.props.location.search.length < 150) {
      this.setState({
        errors: ['ChangePassword.error-1'],
        errorDisplay: true
      })
    } else {
      this.setState({
        errors: ['ChangePassword.error-2'],
        errorDisplay: true
      })
    }
  }

  listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      this.changePassword(event)
    }
  }

  render() {
    const { t } = this.props
    let errorDisplay, successDisplay

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>{t('ChangePassword.error-header')}</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{t(error)}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.successDisplay) {
      successDisplay = (
        <Message success textAlign='center'>
          {t('ChangePassword.success-msg')}
        </Message>
      )
    }

    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('ChangePassword.title')}
        </Header>
        <Segment className='whitebox'>
          <p style={{ 'textAlign': 'center' }}>
            {t('ChangePassword.instructions')}
          </p>
          <Form>
            <Form.Input
              required
              id='password'
              value={this.state.password}
              onChange={this.onChangeHandler}
              placeholder={t('reusable-placeholders.password')}
              type='password'
              onKeyPress={this.listenEnterKey}
            />
            <Form.Input
              required
              id='passwordConfirmation'
              value={this.state.passwordConfirmation}
              onChange={this.onChangeHandler}
              placeholder={t('reusable-placeholders.password-confirmation')}
              type='password'
              onKeyPress={this.listenEnterKey}
            />
          </Form>
          {errorDisplay}
          {successDisplay}
          <Button className='submit-button' id='change-pass-button' loading={this.state.loading ? true : false} onClick={this.changePassword}>{t('ChangePassword.title')}</Button>
        </Segment>
      </div>
    )
  }
}

export default withTranslation()(ChangePassword)
