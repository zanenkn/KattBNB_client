import React, { Component } from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'
import OutgoingRequests from './OutgoingRequests'
import OutgoingUpcoming from './OutgoingUpcoming'
import OutgoingHistory from './OutgoingHistory'

class OutgoingBookings extends Component {
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
          Outgoing bookings
        </Header>
        <p style={{ 'textAlign': 'center' }}>
          You booking your cat(s) to stay with hosts.
        </p>
        <Button onClick={() => {this.requests.scrollIntoView({ behavior: "smooth" })}}>
          View Requests
        </Button>
        <Button onClick={() => {this.upcoming.scrollIntoView({ behavior: "smooth" })}}>
          View Upcoming
        </Button>
        <Button onClick={() => {this.history.scrollIntoView({ behavior: "smooth" })}}>
          View History
        </Button>
        <div style={{'height': '8vh'}} ref={(el) => { this.requests = el }} />
        <Header as='h2' style={{ 'marginBottom': '0' }}>
          Requests
        </Header>
        <OutgoingRequests
          requests={this.props.location.state.outgoingRequests}
        />
        <div style={{'height': '8vh'}} ref={(el) => { this.upcoming = el }} />
        <Header as='h2' style={{ 'marginBottom': '0' }}>
          Upcoming
        </Header>
        <OutgoingUpcoming
          upcoming={this.props.location.state.outgoingUpcoming}
        />
        <div style={{'height': '8vh'}} ref={(el) => { this.history = el }} />
        <Header as='h2' style={{ 'marginBottom': '0' }}>
          History
        </Header>
        
        <OutgoingHistory
          history={this.props.location.state.outgoingHistory}
        />
        <div className='scroll-to-top '>
          <Icon link="#" name='angle up' size='huge' color='grey' onClick={ this.scrollToTop }/>
        </div>
      </div>
    )
  }
}

export default OutgoingBookings
