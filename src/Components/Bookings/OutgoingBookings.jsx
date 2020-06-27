import React, { Component } from 'react'
import { Header, Button, Icon, Container } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import { withTranslation } from 'react-i18next'
import OutgoingRequests from './OutgoingRequests'
import OutgoingUpcoming from './OutgoingUpcoming'
import OutgoingHistory from './OutgoingHistory'

class OutgoingBookings extends Component {

  state = {
    scrollYPosition: 0
  }

  componentDidMount() { window.addEventListener('scroll', this.handleScroll) }

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

    if (this.props.tReady) {
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
          <Container style={{ 'marginTop': '150px' }}>
            <div className='expanding-wrapper' style={{ 'paddingTop': '2rem' }}>
              <div ref={(el) => { this.requests = el }} style={{ 'marginTop': '-36vh', 'paddingTop': '36vh' }}>
                <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '0' }}>
                  {t('OutgoingBookings:requests')}
                </Header>
                <OutgoingRequests
                  requests={this.props.location.state.outgoingRequests}
                />
              </div>
              <div style={{ 'height': '8vh' }} ref={(el) => { this.upcoming = el }} style={{ 'marginTop': '-36vh', 'paddingTop': '36vh' }}>
                <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '3rem' }}>
                  {t('OutgoingBookings:upcoming')}
                </Header>
                <OutgoingUpcoming
                  upcoming={this.props.location.state.outgoingUpcoming}
                />
              </div>
              <div style={{ 'height': '8vh' }} ref={(el) => { this.history = el }} style={{ 'marginTop': '-36vh', 'paddingTop': '36vh' }}>
                <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '3rem' }}>
                  {t('OutgoingBookings:history')}
                </Header>
                <OutgoingHistory
                  outHistoryBookings={this.props.location.state.outgoingHistory}
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

export default withTranslation('OutgoingBookings')(OutgoingBookings)
