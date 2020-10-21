import React, { Component } from 'react'
import withAuth from '../../HOC/withAuth'
import { Header, Button, Icon, Container, Message } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import { withTranslation } from 'react-i18next'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import IncomingRequests from './IncomingRequests'
import IncomingUpcoming from './IncomingUpcoming'
import IncomingHistory from './IncomingHistory'

class IncomingBookings extends Component {

  state = {
    scrollYPosition: 0,
    incomingBookings: [],
    loading: true,
    errorDisplay: false,
    errors: []
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    const lang = detectLanguage()
    const { t } = this.props
    if (window.navigator.onLine === false) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator']
      })
    } else if (window.history.state === null) {
      window.location.replace('/all-bookings')
    } else {
      const inBookings = `/api/v1/bookings?stats=no&host_nickname=${this.props.location.state.hostNickname}&locale=${lang}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.get(inBookings, { headers: headers })
        .then(response => {
          this.setState({
            incomingBookings: response.data,
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

  componentWillUnmount() { window.removeEventListener('scroll', this.handleScroll) }

  handleScroll = () => {
    this.setState({ scrollYPosition: window.scrollY })
  }

  scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  render() {

    const { t } = this.props

    if (this.props.tReady && this.state.loading === false) {
      let todaysDate = new Date()
      let utc = Date.UTC(todaysDate.getUTCFullYear(), todaysDate.getUTCMonth(), todaysDate.getUTCDate())
      let today = new Date(utc).getTime()
      let errorDisplay
      let incomingRequests = []
      let incomingUpcoming = []
      let incomingHistory = []
      this.state.incomingBookings.map(booking => {
        if (booking.status === 'pending') {
          incomingRequests.push(booking)
        } else if (booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today) {
          incomingUpcoming.push(booking)
        } else {
          incomingHistory.push(booking)
        }
      })

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

      const IncomingBookingsButton = (
        <Button style={{ 'marginTop': '0' }} onClick={() => { this.history.scrollIntoView({ behavior: 'smooth' }) }} />
      )

      return (
        <>
          <div id='secondary-sticky' style={{ 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center' }}>
            <Header as='h1' style={{ 'marginBottom': '0', 'margin': '0 auto', 'alignSelf': 'flex-start' }}>
              {t('IncomingBookings:main-header')}
            </Header>
            <p style={{ 'textAlign': 'center', 'margin': '0 auto 1rem' }}>
              {t('IncomingBookings:main-desc')}
            </p>
            <div style={{ 'display': 'flex', 'justifyContent': 'center' }}>
              <Button.Group size='mini'>
                <IncomingBookingsButton>
                  {t('IncomingBookings:requests')}
                </IncomingBookingsButton>
                <IncomingBookingsButton>
                  {t('IncomingBookings:upcoming')}
                </IncomingBookingsButton>
                <IncomingBookingsButton>
                  {t('IncomingBookings:history')}
                </IncomingBookingsButton>
              </Button.Group>
            </div>
          </div>
          <Container style={{ 'paddingTop': '150px' }}>
            <div className='expanding-wrapper'>
              {errorDisplay}
              <div ref={(el) => { this.requests = el }} className='booking-type-wrapper'>
                <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '2rem' }}>
                  {t('IncomingBookings:requests')}
                </Header>
                <IncomingRequests
                  requests={incomingRequests}
                />
              </div>
              <div ref={(el) => { this.upcoming = el }} className='booking-type-wrapper'>
                <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '3rem' }}>
                  {t('IncomingBookings:upcoming')}
                </Header>
                <IncomingUpcoming
                  upcoming={incomingUpcoming}
                />
              </div>
              <div ref={(el) => { this.history = el }} className='booking-type-wrapper'>
                <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '3rem' }}>
                  {t('IncomingBookings:history')}
                </Header>
                <IncomingHistory
                  inHistoryBookings={incomingHistory}
                />
              </div>
              <div className='scroll-to-top '>
                <Icon link='#' name='angle up' size='huge' color='grey' style={this.state.scrollYPosition < 200 ? { 'display': 'none' } : { 'display': 'block' }} onClick={this.scrollToTop} />
              </div>
            </div>
          </Container>
        </>
      )
    } else { return <Spinner /> }
  }
}

export default withTranslation('IncomingBookings')(withAuth(IncomingBookings))
