import React, { Component } from 'react'
import { Container, Header } from 'semantic-ui-react'

class List extends Component {

  search(hosts, checkIn, checkOut) {
    let booking = []
    let startDate = Date.parse(checkIn.toString())
    let stopDate = Date.parse(checkOut.toString())
    let currentDate = startDate
    while (currentDate <= stopDate) {
      booking.push(currentDate)
      currentDate = currentDate + 24*3600*1000
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
    let searchMessage
    let availableHosts = []
    let name

    if (this.props.searchDataLocation !== '' && this.props.searchDataLocation.length === 0) {
      searchMessage = (
        <Header>
          Your search did not yield any results! Try changing your search criteria or go to the map to find cat sitters in nearby areas.
        </Header>
      )
    }

    if (this.props.searchDataLocation !== '' && this.props.searchDataLocation.length > 0) {
      let availableByDate = this.search(this.props.searchDataLocation, this.props.checkInDate, this.props.checkOutDate)
      availableByDate.map(host => {
        if (host.max_cats_accepted >= this.props.numberOfCats) {
          availableHosts.push(host)
        }
      })
      name = availableHosts[0].user.nickname
    }


    return (
      <Container style={{ 'background': '#ECECEC', 'height': '100vh' }}>
        {searchMessage}
        {name}
      </Container>
    )
  }
}

export default List
