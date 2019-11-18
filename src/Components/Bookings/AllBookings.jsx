import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Header, Button } from 'semantic-ui-react'

class AllBookings extends Component {

  state = {
    outgoingBookings: []
  }

  componentDidMount() {
    const path = `/api/v1/bookings?user_id=${this.props.id}`
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    axios.get(path, { headers: headers }).then(response => {
      this.setState({ outgoingBookings: response.data })
    })
  }

  render() {
    let outgoingRequests = []
    let outgoingUpcoming = []
    let outgoingHistory = []
    let todaysDate = new Date()
    let utc = Date.UTC(todaysDate.getUTCFullYear(), todaysDate.getUTCMonth(), todaysDate.getUTCDate())
    let today = new Date(utc).getTime()
    let outgoingBookingStats

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
        <p className='small-centered-paragraph'>
          Requests: {outgoingRequests.length}&nbsp;
          Upcoming: {outgoingUpcoming.length}&nbsp;
          History: {outgoingHistory.length}
        </p>
      )
    } else {
      outgoingBookingStats = (
        <p className='small-centered-paragraph'>
          You don't have any Outgoing Bookings yet.
        </p>
      )
    }

    return (
      <div className='expanding-wrapper'>
        <Header as='h1'>
          Hi, {this.props.username}!
        </Header>
        <p style={{ 'textAlign': 'center' }}>
          Here you can manage your bookings.
        </p>
        <Button onClick={() => {
          this.props.history.push({
            pathname: '/outgoing-bookings',
            state: {
              outgoingRequests: outgoingRequests,
              outgoingUpcoming: outgoingUpcoming,
              outgoingHistory: outgoingHistory
            }
          })
        }}>View outgoing bookings</Button>
        {outgoingBookingStats}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id
})

export default connect(mapStateToProps)(AllBookings)
