import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import List from './List'

class SearchResults extends Component {

  state = {
    checkInDate: '',
    checkOutDate: '',
    numberOfCats: '',
    location: '',
    searchDataLocation: ''
  }

  componentDidMount() {
    if (this.props.history.location.state === undefined) {
      this.props.history.push({ pathname: '/' })
    } else {
      this.setState({
        checkInDate: this.props.history.location.state.from,
        checkOutDate: this.props.history.location.state.to,
        numberOfCats: this.props.history.location.state.cats,
        location: this.props.history.location.state.location,
        searchDataLocation: this.props.history.location.state.searchData
      })
    }
  }

  search(hosts, checkIn, checkOut) {
    let booking = []
    let startDate = Date.parse(checkIn.toString())
    let stopDate = Date.parse(checkOut.toString())
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
    let searchMessage
    let inDate = this.state.checkInDate.toString().slice(0, 15)
    let outDate = this.state.checkOutDate.toString().slice(0, 15)
    let finalAvailableHosts = []

    if (this.state.searchDataLocation !== '' && this.state.searchDataLocation.length > 0) {
      let availableByDate = this.search(this.state.searchDataLocation, this.state.checkInDate, this.state.checkOutDate)
      availableByDate.map(host => {
        if (host.max_cats_accepted >= this.state.numberOfCats) {
          finalAvailableHosts.push(host)
        }
      })
    }


    return (
      <>
        <Grid style={{ 'height': '30vh'}}>
          <Grid.Row>
            <Grid.Column width={8}>
              <p style={{ 'color': '#c90c61', 'textAlign': 'center' }}>
                <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
                &nbsp;{this.state.location}&ensp;
              </p>
            </Grid.Column>
            <Grid.Column width={8}>
              <p style={{ 'color': '#c90c61', 'textAlign': 'center' }}>
                {finalAvailableHosts.length} result(s)
              </p>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} style={{ 'textAlign': 'right' }}>
              <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><polygon points='16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9' /></svg>
              &nbsp;{inDate}&ensp;
            </Grid.Column>
            <Grid.Column width={4} style={{ 'textAlign': 'right' }}>
              <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><polygon points='3.828 9 9.899 2.929 8.485 1.515 0 10 .707 10.707 8.485 18.485 9.899 17.071 3.828 11 20 11 20 9 3.828 9' /></svg>
              &nbsp;{outDate}&ensp;
            </Grid.Column>
            <Grid.Column width={8} style={{ 'textAlign': 'center' }}>
              <p style={{ 'color': '#c90c61' }}>
                <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 236.62 236.62'><path d='M197.023,225.545c-1.145-9.533-11.68-10.614-17.805-9.958c-6.521-24.554,16.225-61.151,17.563-69.82c1.438-9.312-6.658-63.5-7.513-90.938C188.389,26.662,147.48-4.433,140.65,0.524c-6.768,7.484,9.748,17.585,1.054,26.245c-8.398,8.367-10.588,13.99-16.824,23.46c-15.976,24.255,27.318,24.558,27.318,24.558s-33.882,25.112-41.421,37.768c-6.943,11.656-9.854,24.696-18.232,35.688c-19.094,25.051-14.791,68.729-14.791,68.729s-36.17-11.839-16.264-53.133C76.643,132.406,84.107,86.02,50.016,97.95c-13.189,4.616,2.949,14.325,5.734,17.435c9.318,10.4,1.441,27.896-4.174,38.012c-15.037,27.091-20.496,55.475,11.154,72.978c14.063,7.776,33.055,9.7,52.17,9.982l48.64,0.14C179.564,237.294,197.689,234.298,197.023,225.545z' /></svg>
                &nbsp;{this.state.numberOfCats}&ensp;
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {searchMessage}
        <List
          finalAvailableHosts={finalAvailableHosts}
          numberOfCats={this.state.numberOfCats}
          booking={this.state.booking}
          checkInDate={this.state.checkInDate}
          checkOutDate={this.state.checkOutDate}
        />
      </>
    )
  }
}

export default SearchResults
