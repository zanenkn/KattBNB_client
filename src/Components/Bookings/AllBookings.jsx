import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Header, Button, Segment } from 'semantic-ui-react'

class AllBookings extends Component {

  state = {
    outgoingBookings: [],
    incomingBookings: []
  }

  componentDidMount() {
    const pathOutgoing = `/api/v1/bookings?user_id=${this.props.id}`
    const pathIncoming = `/api/v1/bookings?host_nickname=${this.props.username}`
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    axios.get(pathOutgoing, { headers: headers }).then(response => {
      this.setState({ outgoingBookings: response.data })
    })
    axios.get(pathIncoming, { headers: headers }).then(response => {
      this.setState({ incomingBookings: response.data })
    })
  }

  render() {
    let outgoingRequests = []
    let outgoingUpcoming = []
    let outgoingHistory = []
    let incomingRequests = []
    let incomingUpcoming = []
    let incomingHistory = []
    let todaysDate = new Date()
    let utc = Date.UTC(todaysDate.getUTCFullYear(), todaysDate.getUTCMonth(), todaysDate.getUTCDate())
    let today = new Date(utc).getTime()
    let outgoingBookingStats, incomingBookingStats, incomingSegment, outgoingSegment

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
        <>
          <p style={{'textAlign': 'center'}}>
            You booking your cat(s) to stay with hosts.
          </p>
          <p className='small-centered-paragraph'>
            Requests:&nbsp;{outgoingRequests.length}&thinsp;
            Upcoming:&nbsp;{outgoingUpcoming.length}&thinsp;
            History:&nbsp;{outgoingHistory.length}
          </p>
        </>
      )
    } else {
      outgoingBookingStats = (
        <p className='small-centered-paragraph'>
          You don't have any Outgoing bookings yet.
        </p>
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
        <>
          <p style={{ 'textAlign': 'center' }}>
            You hosting other people's cats.
          </p>
          <p className='small-centered-paragraph'>
            Requests:&nbsp;{incomingRequests.length}&thinsp;
            Upcoming:&nbsp;{incomingUpcoming.length}&thinsp;
            History:&nbsp;{incomingHistory.length}
          </p>
        </>
      )
    } else {
      incomingBookingStats = (
        <p className='small-centered-paragraph'>
          You don't have any Incoming bookings yet.
        </p>
      )
    }

    incomingSegment = (
      <Segment className='whitebox'>
        <Header as='h3'>
          Incoming bookings
        </Header>
        {incomingBookingStats}   
        <Header className='fake-link' style={{'cursor': 'pointer', 'textAlign': 'center', 'marginTop': '1rem', 'textDecoration': 'underline', 'display': `${this.state.incomingBookings.length > 0 ? 'block' : 'none'}`}} id='view-incoming-bookings' 
          onClick={() => {
            this.props.history.push({
              pathname: '/incoming-bookings',
              state: {
                incomingRequests: incomingRequests,
                incomingUpcoming: incomingUpcoming,
                incomingHistory: incomingHistory
              }
            })
          }}>View</Header>          
      </Segment>
    )

    outgoingSegment = (
      <Segment className='whitebox'>
        <Header as='h3'>
          Outgoing bookings
        </Header>
        {outgoingBookingStats}
        <Header className='fake-link' style={{'cursor': 'pointer', 'textAlign': 'center', 'marginTop': '1rem', 'textDecoration': 'underline', 'display': `${this.state.outgoingBookings.length > 0 ? 'block' : 'none'}`}} id='view-outgoing-bookings'
          onClick={() => {
            this.props.history.push({
              pathname: '/outgoing-bookings',
              state: {
                outgoingRequests: outgoingRequests,
                outgoingUpcoming: outgoingUpcoming,
                outgoingHistory: outgoingHistory
              }
            })
          }}>View</Header>
      </Segment>
    )

    return (
      <div className='content-wrapper'>
        <Header as='h1'>
          Hi, {this.props.username}!
        </Header>
        <p style={{ 'textAlign': 'center' }}>
          Here you can manage your bookings.
        </p>
        {this.state.incomingBookings.length > 0 ? <>{incomingSegment}{outgoingSegment}</> : <>{outgoingSegment}{incomingSegment}</>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id
})

export default connect(mapStateToProps)(AllBookings)
