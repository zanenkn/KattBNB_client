import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

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
    return (
      <>
        {this.state.outgoingBookings.length}
      </>
    )
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id
})

export default connect(mapStateToProps)(AllBookings)
