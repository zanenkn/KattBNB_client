import React, { Component } from 'react'

class Map extends Component {

  state = {

  }

  componentDidMount() {

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

export default Map
