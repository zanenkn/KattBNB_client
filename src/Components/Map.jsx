import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

class Map extends Component {

  state = {
    searchData: ''
  }

  componentDidMount() {
    axios.get('/api/v1/host_profiles').then(response => {
      this.setState({
        searchData: response.data
      })
    })
  }

  getBookingLength(checkIn, checkOut) {
    let dateArray = []
    let startDate = checkIn
    let stopDate = checkOut
    let currentDate = startDate
    while (currentDate <= stopDate) {
      dateArray.push(currentDate)
      currentDate = currentDate + 86400000
    }
    return dateArray.length
  }

  search(hosts, checkIn, checkOut) {
    let booking = []
    let startDate = checkIn
    let stopDate = checkOut
    let currentDate = startDate
    while (currentDate <= stopDate) {
      booking.push(currentDate)
      currentDate = currentDate + 86400000
    }
    let availableHosts = []
    hosts.map(host => {
      let matcher = []
      booking.map(date => {
        if ((host.availability).includes(date)) {
          matcher.push(date)
        }
      })
      if (JSON.stringify(matcher) === JSON.stringify(booking)) {
        availableHosts.push(host)
      }
    })
    return availableHosts
  }

  render() {


    return (
      <p id='map'>
        map
      </p>
    )
  }
}

const mapStateToProps = state => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
})

export default connect(mapStateToProps)(Map)
