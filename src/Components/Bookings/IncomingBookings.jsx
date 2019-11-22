import React, { Component } from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'
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
      <div className='expanding-wrapper'>
        <Header as='h1' style={{ 'marginBottom': '0' }}>
          Incoming bookings
        </Header>
        <p style={{ 'textAlign': 'center' }}>
          You hosting other people's cats.
        </p>
        <Button onClick={() => { this.requests.scrollIntoView({ behavior: 'smooth' }) }}>
          View Requests
        </Button>
        <Button onClick={() => { this.upcoming.scrollIntoView({ behavior: 'smooth' }) }}>
          View Upcoming
        </Button>
        <Button onClick={() => { this.history.scrollIntoView({ behavior: 'smooth' }) }}>
          View History
        </Button>
        <div style={{ 'height': '8vh' }} ref={(el) => { this.requests = el }} />
        <Header as='h2' style={{ 'marginBottom': '0' }}>
          Requests
        </Header>
        <IncomingRequests
          requests={this.props.location.state.incomingRequests}
        />
        <div style={{ 'height': '8vh' }} ref={(el) => { this.upcoming = el }} />
        <Header as='h2' style={{ 'marginBottom': '0' }}>
          Upcoming
        </Header>
        <IncomingUpcoming
          upcoming={this.props.location.state.incomingUpcoming}
        />
        <div style={{ 'height': '8vh' }} ref={(el) => { this.history = el }} />
        <Header as='h2' style={{ 'marginBottom': '0' }}>
          History
        </Header>
        <IncomingHistory
          history={this.props.location.state.incomingHistory}
        />
        <div className='scroll-to-top '>
          <Icon link='#' name='angle up' size='huge' color='grey' style={this.state.scrollYPosition < 200 ? { 'display': 'none' } : { 'display': 'block' }} onClick={this.scrollToTop} />
        </div>
      </div>
    )
  }
}

export default IncomingBookings
