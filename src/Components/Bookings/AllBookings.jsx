import React, { Component } from 'react'
import withAuth from '../../HOC/withAuth'
import Spinner from '../ReusableComponents/Spinner'
import axios from 'axios'
import Popup from 'reactjs-popup'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import { connect } from 'react-redux'
import { withTranslation, Trans } from 'react-i18next'
import { Header, Segment, Button, Message } from 'semantic-ui-react'

class AllBookings extends Component {

  state = {
    errorDisplay: false,
    errors: [],
    stats: {},
    loading: true
  }

  componentDidMount() {
    const lang = detectLanguage()
    const { t } = this.props
    if (window.navigator.onLine === false) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator']
      })
    } else {
      const bookings = `/api/v1/bookings?stats=yes&user_id=${this.props.id}&host_nickname=${this.props.username}&locale=${lang}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.get(bookings, { headers: headers })
        .then(response => {
          this.setState({
            stats: response.data.stats,
            loading: false,
            errorDisplay: false,
            errors: []
          })
        })
        .catch(error => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 500) {
            this.setState({
              loading: false,
              errorDisplay: true,
              errors: ['reusable:errors:500']
            })
          } else if (error.response.status === 503) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'))
            wipeCredentials('/')
          } else {
            this.setState({
              loading: false,
              errorDisplay: true,
              errors: [error.response.data.error]
            })
          }
        })
    }
  }

  render() {
    const { t } = this.props

    if (this.props.tReady && this.state.loading === false) {
      let outgoingRequests = parseInt(this.state.stats.out_requests)
      let outgoingUpcoming = parseInt(this.state.stats.out_upcoming)
      let outgoingHistory = parseInt(this.state.stats.out_history)
      let incomingRequests = parseInt(this.state.stats.in_requests)
      let incomingUpcoming = parseInt(this.state.stats.in_upcoming)
      let incomingHistory = parseInt(this.state.stats.in_history)
      let incomingBookingStats, incomingSegment, incomingText, incomingCTA, outgoingBookingStats, outgoingSegment, outgoingText, outgoingCTA, errorDisplay

      if (this.state.errorDisplay) {
        errorDisplay = (
          <Message negative >
            <ul id='message-error-list'>
              {this.state.errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )
      }

      if (outgoingRequests !== 0 || outgoingUpcoming !== 0 || outgoingHistory !== 0) {
        outgoingBookingStats = (
          <p className='small-centered-paragraph' style={{ 'color': 'white' }}>
            {t('AllBookings:requests')}&nbsp;{outgoingRequests}&thinsp;
            {t('AllBookings:upcoming')}&nbsp;{outgoingUpcoming}&thinsp;
            {t('AllBookings:history')}&nbsp;{outgoingHistory}
          </p>
        )
        outgoingText = (
          <p style={{ 'textAlign': 'center' }}>
            {t('AllBookings:outgoing-text')}
          </p>
        )
        outgoingCTA = (
          <Header className='fake-link' style={{ 'cursor': 'pointer', 'textAlign': 'center', 'marginTop': '1rem', 'textDecoration': 'underline' }} id='view-outgoing-bookings'
            onClick={() => {
              this.props.history.push({
                pathname: '/outgoing-bookings',
                state: { userId: this.props.id }
              })
            }}
          >
            {t('AllBookings:view')}
          </Header>
        )
      } else {
        outgoingBookingStats = (
          <p className='small-centered-paragraph' style={{ 'color': 'white' }}>
            {t('AllBookings:outgoing-booking-stats')}
          </p>
        )
        outgoingText = (
          <p style={{ 'textAlign': 'center' }}>
            {t('AllBookings:outgoing-text-2')}
          </p>
        )
        outgoingCTA = (
          <Header
            className='fake-link'
            style={{ 'cursor': 'pointer', 'textAlign': 'center', 'marginTop': '1rem', 'textDecoration': 'underline' }} id='view-outgoing-bookings'
            onClick={() => { this.props.history.push('/search') }}
          >
            {t('AllBookings:outgoing-cta')}
          </Header>
        )
      }

      if (incomingRequests !== 0 || incomingUpcoming !== 0 || incomingHistory !== 0) {
        incomingBookingStats = (
          <p className='small-centered-paragraph' style={{ 'color': 'white' }}>
            {t('AllBookings:requests')}&nbsp;{incomingRequests}&thinsp;
            {t('AllBookings:upcoming')}&nbsp;{incomingUpcoming}&thinsp;
            {t('AllBookings:history')}&nbsp;{incomingHistory}
          </p>
        )

        if (incomingRequests !== 0) {
          incomingText = (
            <p style={{ 'textAlign': 'center' }}>
              <Trans count={parseInt(incomingRequests)} i18nKey='AllBookings:incoming-text'>
                You have <strong style={{ 'color': '#c90c61' }}>{{ count: incomingRequests }} incoming booking request</strong> awaiting your decision.
              </Trans>
            </p>
          )
          incomingCTA = (
            <Button id='view-incoming-bookings'
              onClick={() => {
                this.props.history.push({
                  pathname: '/incoming-bookings',
                  state: { hostNickname: this.props.username }
                })
              }}
            >
              {t('AllBookings:view')}
            </Button>
          )
        } else {
          incomingText = (
            <p style={{ 'textAlign': 'center' }}>
              {t('AllBookings:incoming-text-2')}
            </p>
          )
          incomingCTA = (
            <Header className='fake-link' style={{ 'cursor': 'pointer', 'textAlign': 'center', 'marginTop': '1rem', 'textDecoration': 'underline' }} id='view-incoming-bookings'
              onClick={() => {
                this.props.history.push({
                  pathname: '/incoming-bookings',
                  state: { hostNickname: this.props.username }
                })
              }}
            >
              {t('AllBookings:view')}
            </Header>
          )
        }
      } else {
        incomingBookingStats = (
          <p className='small-centered-paragraph' style={{ 'color': 'white' }}>
            {t('AllBookings:outgoing-booking-stats')}
          </p>
        )
        incomingText = (
          <p style={{ 'textAlign': 'center' }}>
            {t('AllBookings:incoming-text-3')}
          </p>
        )
        incomingCTA = (
          <Header
            className='fake-link'
            style={{ 'cursor': 'pointer', 'textAlign': 'center', 'marginTop': '1rem', 'textDecoration': 'underline' }} id='view-incoming-bookings'
            onClick={() => { this.props.history.push('/faq?section=sitter&active=201') }}
          >
            {t('AllBookings:incoming-cta')}
          </Header>
        )
      }

      outgoingSegment = (
        <Segment className='box-shadow'>
          <div className='topbox'>
            <Header as='h3' style={{ 'color': 'white', 'marginBottom': '0' }}>{t('AllBookings:outgoing-segment')}</Header>
            {outgoingBookingStats}
          </div>
          {outgoingText}
          {outgoingCTA}
        </Segment>
      )

      incomingSegment = (
        <Segment className='box-shadow'>
          <div className='topbox'>
            <Header as='h3' style={{ 'color': 'white', 'marginBottom': '0' }}>{t('AllBookings:incoming-segment')}</Header>
            {incomingBookingStats}
          </div>
          {incomingText}
          {incomingCTA}
        </Segment>
      )

      return (
        <>
          <Popup
            modal
            open={this.state.errorDisplay}
            closeOnDocumentClick={true}
            onClose={() => { this.setState({ errors: [] }) }}
            position='top center'
          >
            <div>
              {errorDisplay}
            </div>
          </Popup>
          <div className='content-wrapper'>
            <Header as='h1'>
              {t('AllBookings:hi')} {this.props.username}!
          </Header>
            <p style={{ 'textAlign': 'center' }}>
              {t('AllBookings:header-page')}
            </p>
            {incomingRequests !== 0 || incomingUpcoming !== 0 || incomingHistory !== 0 ? <>{incomingSegment}{outgoingSegment}</> : <>{outgoingSegment}{incomingSegment}</>}
          </div>
        </>
      )
    } else { return <Spinner /> }
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id
})

export default withTranslation('AllBookings')(connect(mapStateToProps)(withAuth(AllBookings)))
