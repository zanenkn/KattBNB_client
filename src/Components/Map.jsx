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
    let finalAvailableHosts = []
    let bookingLength = parseFloat(this.getBookingLength(this.props.checkInDate, this.props.checkOutDate))

    if (this.state.searchData !== '' && this.state.searchData.length > 0) {
      let availableByDate = this.search(this.state.searchData, this.props.checkInDate, this.props.checkOutDate)
      availableByDate.map(host => {
        if (host.max_cats_accepted >= this.props.numberOfCats && this.props.id !== host.user.id) {
          finalAvailableHosts.push(host)
        }
      })
    }


    return (
      <p id='map'>
        map
        {bookingLength}
      </p>
    )
  }
}

const mapStateToProps = state => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
})

export default connect(mapStateToProps)(Map)
