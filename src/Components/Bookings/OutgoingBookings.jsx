import React, { Component } from 'react'
import withAuth from '../../HOC/withAuth'
import { Header, Button, Icon, Container, Message } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import { withTranslation } from 'react-i18next'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import OutgoingRequests from './OutgoingRequests'
import OutgoingUpcoming from './OutgoingUpcoming'
import OutgoingHistory from './OutgoingHistory'

class OutgoingBookings extends Component {

  state = {
    scrollYPosition: 0,
    outgoingBookings: [],
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
      const outBookings = `/api/v1/bookings?stats=no&user_id=${this.props.location.state.userId}&locale=${lang}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.get(outBookings, { headers: headers })
        .then(response => {
          this.setState({
            outgoingBookings: response.data,
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
      let outgoingRequests = []
      let outgoingUpcoming = []
      let outgoingHistory = []
      this.state.outgoingBookings.map(booking => {
        if (booking.status === 'pending') {
          outgoingRequests.push(booking)
        } else if (booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today) {
          outgoingUpcoming.push(booking)
        } else {
          outgoingHistory.push(booking)
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

      return (
        <>
          <div id='secondary-sticky' style={{ 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center' }}>
            <Header as='h1' style={{ 'marginBottom': '0', 'margin': '0 auto' }}>
              {t('OutgoingBookings:main-header')}
            </Header>
            <p style={{ 'textAlign': 'center', 'margin': '0 auto 1rem' }}>
              {t('OutgoingBookings:desc')}
            </p>
            <div style={{ 'display': 'flex', 'justifyContent': 'center' }}>
              <Button.Group size='mini'>
                <Button style={{ 'marginTop': '0' }} onClick={() => { this.requests.scrollIntoView({ behavior: 'smooth' }) }}>
                  {t('OutgoingBookings:requests')}
                </Button>
                <Button style={{ 'marginTop': '0' }} onClick={() => { this.upcoming.scrollIntoView({ behavior: 'smooth' }) }}>
                  {t('OutgoingBookings:upcoming')}
                </Button>
                <Button style={{ 'marginTop': '0' }} onClick={() => { this.history.scrollIntoView({ behavior: 'smooth' }) }}>
                  {t('OutgoingBookings:history')}
                </Button>
              </Button.Group>
            </div>
          </div>
          <Container style={{ 'paddingTop': '150px' }}>
            <div className='expanding-wrapper'>
              {errorDisplay}
              <div ref={(el) => { this.requests = el }} className='booking-type-wrapper'>
                <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '2rem' }}>
                  {t('OutgoingBookings:requests')}
                </Header>
                <OutgoingRequests
                  requests={outgoingRequests}
                />
              </div>
              <div ref={(el) => { this.upcoming = el }} className='booking-type-wrapper'>
                <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '3rem' }}>
                  {t('OutgoingBookings:upcoming')}
                </Header>
                <OutgoingUpcoming
                  upcoming={outgoingUpcoming}
                />
              </div>
              <div ref={(el) => { this.history = el }} className='booking-type-wrapper'>
                <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '3rem' }}>
                  {t('OutgoingBookings:history')}
                </Header>
                <OutgoingHistory
                  outHistoryBookings={outgoingHistory}
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

export default withTranslation('OutgoingBookings')(withAuth(OutgoingBookings))
