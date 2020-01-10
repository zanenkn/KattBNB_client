import React, { Component } from 'react'
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import axios from 'axios'
import { withTranslation } from 'react-i18next'

class PasswordReset extends Component {

  state = {
    email: '',
    errors: '',
    errorDisplay: false,
    loading: false,
    url: 'https://kattbnb.netlify.com/change-password'
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  resetPassword = (e) => {
    this.setState({ loading: true })
    e.preventDefault()
    const path = '/api/v1/auth/password'
    const payload = {
      redirect_url: this.state.url,
      email: this.state.email
    }
    axios.post(path, payload)
      .then(() => {
        this.setState({ errorDisplay: false })
        window.location.replace('/password-reset-success')
      })
      .catch(error => {
        this.setState({
          loading: false,
          errorDisplay: true,
          errors: error.response.data.errors
        })
      })
  }

  listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      this.resetPassword(event)
    }
  }

  render() {
    const { t } = this.props
    let errorDisplay

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header style={{ 'textAlign': 'center' }} >{t('PasswordReset:error-header')}:</Message.Header>
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
          {t('PasswordReset:title')}
        </Header>
        <Segment className='whitebox'>
          <p style={{ 'textAlign': 'center' }}>
            {t('PasswordReset:instructions')}
          </p>
          <Form>
            <Form.Input
              required
              id='email'
              label={t('reusable:plch.email')}
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder={t('reusable:plch.email')}
              onKeyPress={this.listenEnterKey}
            />
          </Form>
          {errorDisplay}
          <Button className='submit-button' id='reset-pass-button' onClick={this.resetPassword} loading={this.state.loading ? true : false}>
            {t('PasswordReset:btn')}
          </Button>
        </Segment>
      </div>
    )
  }
}

export default withTranslation()(PasswordReset)
