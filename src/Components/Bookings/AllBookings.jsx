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
    let requests =[]

    if (this.state.outgoingBookings.length > 0) {
      this.state.outgoingBookings.map(booking => {
        if (booking.status === 'pending') {
          requests.push(booking)
        }
      })
    }

    return (
      <>
        <Header as='h1'>
          Hi, {this.props.username}!
        </Header>

        <p>
          Outgoing Bookings
          Requests: {requests.length}
          Upcoming:
          History:
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
