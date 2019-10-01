import React, { Component } from 'react'
import { Container, Header } from 'semantic-ui-react'

class List extends Component {
  getBookingLength(checkIn, checkOut) {
    let dateArray = []
    let startDate = Date.parse(checkIn.toString())
    let stopDate = Date.parse(checkOut.toString())
    let currentDate = startDate
    while (currentDate <= stopDate) {
        dateArray.push(currentDate)
        currentDate = currentDate + 24*3600*1000
    }
    return dateArray.length
  }

  render() {
    let searchMessage
    let results

    if (this.props.finalAvailableHosts.length === 0) {
      searchMessage = (
        <Header>
          Your search did not yield any results! Try changing your search criteria or go to the map to find cat sitters in nearby areas.
        </Header>
      )
    }

    if (this.props.finalAvailableHosts.length > 0) {
      results = (
        this.props.finalAvailableHosts.map(host => {
          let perDay = (
            parseFloat(host.price_per_day_1_cat) +  (parseFloat(this.props.numberOfCats) - 1) * parseFloat(host.supplement_price_per_cat_per_day)
          )

          let total = (
            parseFloat(perDay) * parseFloat(this.getBookingLength(this.props.checkInDate, this.props.checkOutDate))
          )

          return (
          <Container style={{'background': 'white', 'margin': '1rem'}} id={host.id}>
            <Header>
              {host.user.nickname}
            </Header>
            <p>
              {perDay} kr/day
            </p>
            <p>
              {total} kr total
            </p>
          </Container>
          )
        })
      )
    }


    return (
      <Container style={{ 'background': '#ECECEC', 'height': '100vh' }}>
        {searchMessage}
        {results}
        
      </Container>
    )
  }
}

export default List
