import React, { Component } from 'react'
import Spinner from '../ReusableComponents/Spinner'
import axios from 'axios'
import { connect } from 'react-redux'
import { Header, Segment, Button } from 'semantic-ui-react'

class AllBookings extends Component {

  state = {
    outgoingBookings: [],
    incomingBookings: [],
    loadingOutgoing: true,
    loadingIncoming: true
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
      this.setState({
        outgoingBookings: response.data,
        loadingOutgoing: false
      })
    })
    axios.get(pathIncoming, { headers: headers }).then(response => {
      this.setState({
        incomingBookings: response.data,
        loadingIncoming: false
      })
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
    let incomingBookingStats, incomingSegment, incomingText, incomingCTA, outgoingBookingStats, outgoingSegment, outgoingText, outgoingCTA, page

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
          Requests:&nbsp;{outgoingRequests.length}&thinsp;
          Upcoming:&nbsp;{outgoingUpcoming.length}&thinsp;
          History:&nbsp;{outgoingHistory.length}
        </p>
      )
      outgoingText = (
        <p style={{ 'textAlign': 'center' }}>
          You booking your cat(s) to stay with hosts.
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
          }}>View</Header>
      )
    } else {
      outgoingBookingStats = (
        <p className='small-centered-paragraph' style={{ 'color': 'white' }}>
          None yet.
        </p>
      )
      outgoingText = (
        <p style={{ 'textAlign': 'center' }}>
          Need someone to take care of your cat while you're away?
        </p>
      )
      outgoingCTA = (
        <Header
          className='fake-link'
          style={{ 'cursor': 'pointer', 'textAlign': 'center', 'marginTop': '1rem', 'textDecoration': 'underline' }} id='view-outgoing-bookings'
          onClick={() => { this.props.history.push('/') }}
        >
          Search and book
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
          Requests:&nbsp;{incomingRequests.length}&thinsp;
          Upcoming:&nbsp;{incomingUpcoming.length}&thinsp;
          History:&nbsp;{incomingHistory.length}
        </p>
      )

      if (incomingRequests.length > 0) {
        incomingText = (
          <p style={{ 'textAlign': 'center' }}>
            You have <strong style={{ 'color': '#c90c61' }}>{incomingRequests.length} incoming booking {incomingRequests.length > 1 ? 'requests' : 'request'}</strong> awaiting your decision.
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
            }}>View</Button>
        )
      } else {
        incomingText = (
          <p style={{ 'textAlign': 'center' }}>
            You hosting other people's cats.
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
            }}>View</Header>
        )
      }
    } else {
      incomingBookingStats = (
        <p className='small-centered-paragraph' style={{ 'color': 'white' }}>
          None yet.
        </p>
      )
      incomingText = (
        <p style={{ 'textAlign': 'center' }}>
          Wanna take care of cats and make a bit of money?
        </p>
      )
      incomingCTA = (
        <Header
          className='fake-link'
          style={{ 'cursor': 'pointer', 'textAlign': 'center', 'marginTop': '1rem', 'textDecoration': 'underline' }} id='view-incoming-bookings'
          onClick={() => { this.props.history.push('/faq') }}
        >
          Become a cat host
        </Header>
      )
    }

    outgoingSegment = (
      <Segment className='whitebox'>
        <div className='topbox'>
          <Header as='h3' style={{ 'color': 'white', 'marginBottom': '0' }}>Outgoing bookings</Header>
          {outgoingBookingStats}
        </div>
        {outgoingText}
        {outgoingCTA}
      </Segment>
    )

    incomingSegment = (
      <Segment className='whitebox'>
        <div className='topbox'>
          <Header as='h3' style={{ 'color': 'white', 'marginBottom': '0' }}>Incoming bookings</Header>
          {incomingBookingStats}
        </div>
        {incomingText}
        {incomingCTA}
      </Segment>
    )

    if (this.state.loadingIncoming && this.state.loadingOutgoing) {
      page = (
        <Spinner />
      )
    } else if (this.state.loadingIncoming === false && this.state.loadingOutgoing === false) {
      page = (
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

    return (
      <>
        {page}
      </>
    )
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id
})

export default connect(mapStateToProps)(AllBookings)
