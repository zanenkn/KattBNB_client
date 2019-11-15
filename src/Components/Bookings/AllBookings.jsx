import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Header } from 'semantic-ui-react'

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
    let requests = []
    let upcoming = []
    let declined = []
    let history = []
    let todaysDate = new Date()
    let utc = Date.UTC(todaysDate.getUTCFullYear(), todaysDate.getUTCMonth(), todaysDate.getUTCDate())
    let today =  new Date(utc).getTime()

    if (this.state.outgoingBookings.length > 0) {
      this.state.outgoingBookings.map(booking => {
        if (booking.status === 'pending') {
          requests.push(booking)
        } else if (booking.status === 'declined') {
          declined.push(booking)
        } else if (booking.status === 'accepted' && booking.dates[booking.dates.length-1] > today ) {
          upcoming.push(booking)
        } else {
          history.push(booking)
        }
      })
    }

    return (
      <>
        <Header as='h1'>
          Hi, {this.props.username}!
        </Header>

        <Header as='h3'>
          Outgoing Bookings
        </Header>
        <p className='small-centered-paragraph'>
          Requests: {requests.length}&nbsp;
          Upcoming: {upcoming.length}&nbsp;
          Declined: {declined.length}&nbsp;
          History: {history.length}
        </p>
      </>
    )
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id
})

export default connect(mapStateToProps)(AllBookings)
