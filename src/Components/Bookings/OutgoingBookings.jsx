import React from 'react'
import { Header } from 'semantic-ui-react'
import OutgoingRequests from './OutgoingRequests'
import OutgoingUpcoming from './OutgoingUpcoming'
import OutgoingHistory from './OutgoingHistory'

const OutgoingBookings = (props) => {

  return (
    <div className='expanding-wrapper'>
      <Header as='h1' style={{ 'marginBottom': '0' }}>
        Outgoing bookings
      </Header>
      <p style={{ 'textAlign': 'center' }}>
        You booking your cat(s) to stay with hosts.
      </p>
      <Header as='h2' style={{ 'marginBottom': '0' }}>
        Requests
      </Header>
      <OutgoingRequests
        requests={props.location.state.outgoingRequests}
      />
      <Header as='h2' style={{ 'marginBottom': '0' }}>
        Upcoming
      </Header>
      <OutgoingUpcoming
        upcoming={props.location.state.outgoingUpcoming}
      />
      <Header as='h2' style={{ 'marginBottom': '0' }}>
        History
      </Header>
      <OutgoingHistory
        declined={props.location.state.outgoingDeclined}
        history={props.location.state.outgoingHistory}
      />
    </div>
  )
}

export default OutgoingBookings
