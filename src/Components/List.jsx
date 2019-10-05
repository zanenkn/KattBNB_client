import React, { Component } from 'react'
import { Container, Header, Grid, Image } from 'semantic-ui-react'
import HostScore from './HostScore'

class List extends Component {
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
            parseFloat(host.price_per_day_1_cat) + (parseFloat(this.props.numberOfCats) - 1) * parseFloat(host.supplement_price_per_cat_per_day)
          )

          let total = (
            parseFloat(perDay) * parseFloat(this.getBookingLength(this.props.checkInDate, this.props.checkOutDate))
          )

          return (
            <div className='list-card' id={host.id} key={host.id}>
              <Grid style={{ 'margin': '0' }}>
                <Grid.Column width={5} style={{ 'padding': '0', 'margin': 'auto', 'verticalAlign': 'middle', 'display': 'table' }}>
                  <Image src={host.user.avatar === null ? `https://ui-avatars.com/api/?name=${host.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : host.user.avatar} size='small' style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem' }}></Image>
                  <HostScore />
                </Grid.Column>
                <Grid.Column width={11} style={{ 'padding': '0', 'paddingLeft': '1.5rem', 'margin': 'auto' }}>
                  <div>
                    <Header as='h3' style={{ 'textAlign': 'left', 'marginBottom': '0' }}>
                      {perDay} kr/day
                    </Header>
                    <Header as='h5' style={{ 'textAlign': 'left', 'margin': '0' }}>
                      {total} kr total
                    </Header>
                    <p style={{ 'fontSize': 'small', 'marginTop': '0.3rem' }} >
                      <svg fill='grey' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
                      &ensp;
                    <strong>
                        {host.user.nickname}
                      </strong>
                    </p>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          )
        })
      )
    }


    return (
      <>
        {searchMessage}
        {results}
      </>
    )
  }
}

export default List
