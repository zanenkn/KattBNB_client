import React, { Component } from 'react'
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
    outgoingBookings: [],
    incomingBookings: [],
    loadingOutgoing: true,
    loadingIncoming: true
  }

  componentDidMount() {
    const lang = detectLanguage()
    const { t } = this.props
    if (window.navigator.onLine === false) {
      this.setState({
        loadingIncoming: false,
        loadingOutgoing: false,
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator']
      })
    } else {
      const pathOutgoing = `/api/v1/bookings?user_id=${this.props.id}&locale=${lang}`
      const pathIncoming = `/api/v1/bookings?host_nickname=${this.props.username}&locale=${lang}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.get(pathOutgoing, { headers: headers }).then(response => {
        this.setState({
          outgoingBookings: response.data,
          loadingOutgoing: false,
          errorDisplay: false,
          errors: []
        })
      }).catch(error => {
        if (error.response.status === 500) {
          this.setState({
            loadingOutgoing: false,
            loadingIncoming: false,
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
            loadingOutgoing: false,
            loadingIncoming: false,
            errorDisplay: true,
            errors: [error.response.data.error]
          })
        }
      })
      axios.get(pathIncoming, { headers: headers }).then(response => {
        this.setState({
          incomingBookings: response.data,
          loadingIncoming: false,
          errorDisplay: false,
          errors: []
        })
      }).catch(error => {
        if (error.response.status === 500) {
          this.setState({
            loadingOutgoing: false,
            loadingIncoming: false,
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
            loadingOutgoing: false,
            loadingIncoming: false,
            errorDisplay: true,
            errors: [error.response.data.error]
          })
        }
      })
    }
  }

  render() {
    const { t } = this.props
    let outgoingRequests = []
    let outgoingUpcoming = []
    let outgoingHistory = []
    let incomingRequests = []
    let incomingUpcoming = []
    let incomingHistory = []
    let todaysDate = new Date()
    let utc = Date.UTC(todaysDate.getUTCFullYear(), todaysDate.getUTCMonth(), todaysDate.getUTCDate())
    let today = new Date(utc).getTime()
    let incomingBookingStats, incomingSegment, incomingText, incomingCTA, outgoingBookingStats, outgoingSegment, outgoingText, outgoingCTA, page, errorDisplay

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

    if (this.state.outgoingBookings.length > 0) {
      this.state.outgoingBookings.map(booking => {
        if (booking.status === 'pending') {
          outgoingRequests.push(booking)
        } else if (booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today) {
          outgoingUpcoming.push(booking)
        } else {
          outgoingHistory.push(booking)
        }
      })
      outgoingBookingStats = (
        <p className='small-centered-paragraph' style={{ 'color': 'white' }}>
          {t('AllBookings:requests')}&nbsp;{outgoingRequests.length}&thinsp;
          {t('AllBookings:upcoming')}&nbsp;{outgoingUpcoming.length}&thinsp;
          {t('AllBookings:history')}&nbsp;{outgoingHistory.length}
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
              state: {
                outgoingRequests: outgoingRequests,
                outgoingUpcoming: outgoingUpcoming,
                outgoingHistory: outgoingHistory
              }
            })
          }}>{t('AllBookings:view')}</Header>
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
          onClick={() => { this.props.history.push('/') }}
        >
          {t('AllBookings:outgoing-cta')}
        </Header>
      )
    }

    if (this.state.incomingBookings.length > 0) {
      this.state.incomingBookings.map(booking => {
        if (booking.status === 'pending') {
          incomingRequests.push(booking)
        } else if (booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today) {
          incomingUpcoming.push(booking)
        } else {
          incomingHistory.push(booking)
        }
      })
      incomingBookingStats = (
        <p className='small-centered-paragraph' style={{ 'color': 'white' }}>
          {t('AllBookings:requests')}&nbsp;{incomingRequests.length}&thinsp;
          {t('AllBookings:upcoming')}&nbsp;{incomingUpcoming.length}&thinsp;
          {t('AllBookings:history')}&nbsp;{incomingHistory.length}
        </p>
      )

      if (incomingRequests.length > 0) {
        incomingText = (
          <p style={{ 'textAlign': 'center' }}>
            <Trans count={parseInt(incomingRequests.length)} i18nKey='AllBookings:incoming-text'>
              You have <strong style={{ 'color': '#c90c61' }}>{{ count: incomingRequests.length }} incoming booking request</strong> awaiting your decision.
            </Trans>
          </p>
        )
        incomingCTA = (
          <Button id='view-incoming-bookings'
            onClick={() => {
              this.props.history.push({
                pathname: '/incoming-bookings',
                state: {
                  incomingRequests: incomingRequests,
                  incomingUpcoming: incomingUpcoming,
                  incomingHistory: incomingHistory
                }
              })
            }}>{t('AllBookings:view')}</Button>
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
                state: {
                  incomingRequests: incomingRequests,
                  incomingUpcoming: incomingUpcoming,
                  incomingHistory: incomingHistory
                }
              })
            }}>{t('AllBookings:view')}</Header>
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
          onClick={() => { this.props.history.push('/faq') }}
        >
          {t('AllBookings:incoming-cta')}
        </Header>
      )
    }

    outgoingSegment = (
      <Segment className='whitebox'>
        <div className='topbox'>
          <Header as='h3' style={{ 'color': 'white', 'marginBottom': '0' }}>{t('AllBookings:outgoing-segment')}</Header>
          {outgoingBookingStats}
        </div>
        {outgoingText}
        {outgoingCTA}
      </Segment>
    )

    incomingSegment = (
      <Segment className='whitebox'>
        <div className='topbox'>
          <Header as='h3' style={{ 'color': 'white', 'marginBottom': '0' }}>{t('AllBookings:incoming-segment')}</Header>
          {incomingBookingStats}
        </div>
        {incomingText}
        {incomingCTA}
      </Segment>
    )

    if (this.state.loadingIncoming === false && this.state.loadingOutgoing === false && this.state.errorDisplay === false) {
      page = (
        <div className='content-wrapper'>
          <Header as='h1'>
            {t('AllBookings:hi')} {this.props.username}!
          </Header>
          <p style={{ 'textAlign': 'center' }}>
            {t('AllBookings:header-page')}
          </p>
          {this.state.incomingBookings.length > 0 ? <>{incomingSegment}{outgoingSegment}</> : <>{outgoingSegment}{incomingSegment}</>}
        </div>
      )
    } else if (this.state.loadingIncoming === false && this.state.loadingOutgoing === false && this.state.errorDisplay) {
      page = (
        <>
        </>
      )
    } else {
      page = (
        <Spinner />
      )
    }

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
        {page}
      </>
    )
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id
})

export default withTranslation('AllBookings')(connect(mapStateToProps)(AllBookings))
