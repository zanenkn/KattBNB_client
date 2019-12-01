import React, { Component } from 'react'
import { Header, Button, Icon, Container } from 'semantic-ui-react'
import IncomingRequests from './IncomingRequests'
import IncomingUpcoming from './IncomingUpcoming'
import IncomingHistory from './IncomingHistory'

class IncomingBookings extends Component {

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

    return (
      <>
        <div style={{ 'height': '26vh', 'paddingLeft': '10vw', 'paddingRight': '10vw', 'paddingBottom': '1rem', 'paddingTop': '1rem', 'position': 'fixed', 'top': '10vh', 'overflow': 'hidden', 'background': 'white', 'width': '100%', 'zIndex': '100', 'boxShadow': '0 0 20px -5px rgba(0,0,0,.2)', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'justifyContent': 'center' }}>
          <Header as='h1' style={{ 'marginBottom': '0', 'margin': '0 auto', 'align-self': 'flex-start' }}>
            Incoming bookings
          </Header>
          <p style={{ 'textAlign': 'center', 'margin': '0 auto 1rem' }}>
            You hosting other people's cats.
          </p>
          <div style={{ 'display': 'flex', 'align-self': 'flex-end', 'margin': '0 auto' }}>
            <Button.Group size='mini'>
              <Button style={{ 'marginTop': '0' }} onClick={() => { this.requests.scrollIntoView({ behavior: 'smooth' }) }}>
                Requests
              </Button>
              <Button style={{ 'marginTop': '0' }} onClick={() => { this.upcoming.scrollIntoView({ behavior: 'smooth' }) }}>
                Upcoming
              </Button>
              <Button style={{ 'marginTop': '0' }} onClick={() => { this.history.scrollIntoView({ behavior: 'smooth' }) }}>
                History
              </Button>
            </Button.Group>
          </div>
        </div>
        <Container style={{ 'marginTop': '26vh' }}>
          <div className='expanding-wrapper'>
            <div ref={(el) => { this.requests = el }} style={{'marginTop': '-36vh', 'paddingTop': '36vh'}}>
              <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '0' }}>
                Requests
              </Header>
              <IncomingRequests
                requests={this.props.location.state.incomingRequests}
              />
            </div>
            <div ref={(el) => { this.upcoming = el }} style={{'marginTop': '-36vh', 'paddingTop': '36vh'}}>
              <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '3rem' }}>
                Upcoming
              </Header>
              <IncomingUpcoming
                upcoming={this.props.location.state.incomingUpcoming}
              />
            </div>
            <div ref={(el) => { this.history = el }} style={{'marginTop': '-36vh', 'paddingTop': '36vh'}}>
              <Header as='h2' style={{ 'marginBottom': '0', 'marginTop': '3rem' }}>
                History
              </Header>
              <IncomingHistory
                history={this.props.location.state.incomingHistory}
              />
            </div>
            <div className='scroll-to-top '>
              <Icon link='#' name='angle up' size='huge' color='grey' style={this.state.scrollYPosition < 200 ? { 'display': 'none' } : { 'display': 'block' }} onClick={this.scrollToTop} />
            </div>
          </div>
        </Container>
      </>
    )
  }
}

export default IncomingBookings
