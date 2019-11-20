import React, { Component } from 'react'
import { Header, Button } from 'semantic-ui-react'
import OutgoingRequests from './OutgoingRequests'
import OutgoingUpcoming from './OutgoingUpcoming'
import OutgoingHistory from './OutgoingHistory'

class OutgoingBookings extends Component {
  render() {
    return (
      <div className='expanding-wrapper'>
        <Header as='h1' style={{ 'marginBottom': '0' }}>
          Outgoing bookings
        </Header>
        <p style={{ 'textAlign': 'center' }}>
          You booking your cat(s) to stay with hosts.
        </p>
        <Button>
          View Requests
        </Button>
        <Button>
          View Upcoming
        </Button>
        <Button>
          View History
        </Button>
        <Header as='h2' style={{ 'marginBottom': '0' }}>
          Requests
        </Header>
        <OutgoingRequests
          requests={this.props.location.state.outgoingRequests}
        />
        <Header as='h2' style={{ 'marginBottom': '0' }}>
          Upcoming
        </Header>
        <OutgoingUpcoming
          upcoming={this.props.location.state.outgoingUpcoming}
        />
        <Header as='h2' style={{ 'marginBottom': '0' }}>
          History
        </Header>
        <OutgoingHistory
          history={this.props.location.state.outgoingHistory}
        />
      </div>
    )
  }
}

export default OutgoingBookings
