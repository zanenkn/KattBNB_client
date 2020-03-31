import React, { Component } from 'react'
import { Header, Form, Button, Message } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import { withTranslation, Trans } from 'react-i18next'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'

class DeclineRequestPopup extends Component {

  state = {
    message: '',
    loading: false,
    errorDisplay: false,
    errors: ''
  }

  declineBooking = (e) => {
    e.preventDefault()
    const { t } = this.props
    const lang = detectLanguage()
    this.setState({ loading: true })
    if (window.confirm(t('DeclineRequestPopup:confirm-decline'))) {
      if (this.state.message !== '' && this.state.message.length < 201) {
        const path = `/api/v1/bookings/${this.props.id}`
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        const payload = {
          host_message: this.state.message,
          status: 'declined',
          locale: lang
        }
        axios.patch(path, payload, { headers: headers })
          .then(() => {
            window.location.replace('/all-bookings')
          })
          .catch(error => {
            this.setState({
              loading: false,
              errorDisplay: true,
              errors: error.response.data.error
            })
          })
      } else {
        this.setState({
          loading: false,
          errorDisplay: true,
          errors: ['DeclineRequestPopup:decline-error']
        })
        this.props.declModalCloseState(true)
      }
    } else {
      this.setState({ loading: false })
      this.props.declModalCloseState(true)
    }
  }

  declineCTA = (e) => {
    this.props.declModalCloseState(false)
    this.declineBooking(e)
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  render() {
    const { t } = this.props

    if (this.props.tReady) {
      let errorDisplay

      if (this.state.errorDisplay) {
        errorDisplay = (
          <Message negative >
            <Message.Header style={{ 'textAlign': 'center' }} >{t('DeclineRequestPopup:error-message-header')}</Message.Header>
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
          <Header as='h2'>
            {t('DeclineRequestPopup:page-header')}
          </Header>
          <p className='small-centered-paragraph'>
            <Trans i18nKey='DeclineRequestPopup:page-desc' >
              You are about to decline a booking request from <strong style={{ 'color': '#c90c61' }}>{{ nickname: this.props.nickname }}</strong> for the dates of <strong style={{ 'color': '#c90c61' }}>{{ startDate: this.props.startDate }}</strong> until <strong style={{ 'color': '#c90c61' }}>{{ endDate: this.props.endDate }}</strong>
            </Trans>
          </p>
          <Form>
            <Form.TextArea
              style={{ 'minHeight': '120px' }}
              label={t('DeclineRequestPopup:text-area-label')}
              placeholder={t('DeclineRequestPopup:text-area-plch')}
              required
              id='message'
              value={this.state.message}
              onChange={this.onChangeHandler}
            />
          </Form>
          <p style={{ 'textAlign': 'end', 'fontSize': 'smaller', 'fontStyle': 'italic' }}>
            {t('DeclineRequestPopup:remaining')} {200 - this.state.message.length}
          </p>
          {errorDisplay}
          <Button id='decline-button' disabled={this.state.loading} loading={this.state.loading} onClick={this.declineCTA}>{t('DeclineRequestPopup:decline-cta')}</Button>
        </>
      )
    } else { return <Spinner /> }
  }
}

export default withTranslation('DeclineRequestPopup')(DeclineRequestPopup)
