import React, { Component } from 'react'
import { Form, Icon, Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import List from './List'
import Map from './Map'
import moment from 'moment'

class SearchResults extends Component {

  state = {
    checkInDate: '',
    checkOutDate: '',
    numberOfCats: '',
    location: '',
    searchDataLocation: '',
    listResults: true
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
    let inDate = moment(this.state.checkInDate).format('ll')
    let outDate = moment(this.state.checkOutDate).format('ll')
    let finalAvailableHosts = []
    let listButton
    let mapButton
    let results

    if (this.state.searchDataLocation !== '' && this.state.searchDataLocation.length > 0) {
      let availableByDate = this.search(this.state.searchDataLocation, this.state.checkInDate, this.state.checkOutDate)
      availableByDate.map(host => {
        if (host.max_cats_accepted >= this.state.numberOfCats && this.props.id !== host.user.id) {
          finalAvailableHosts.push(host)
        }
      })
    }

    listButton = (
      <Icon name='list' circular inverted style={this.state.listResults ? {'background-color': '#c90c61', 'cursor': 'pointer'} : {'background-color': 'grey', 'cursor': 'pointer'}} onClick={() => {this.setState({listResults: true})}} />
    )

    mapButton = (
      <Icon name='map' circular inverted style={this.state.listResults ? {'background-color': 'grey', 'cursor': 'pointer'} : {'background-color': '#c90c61', 'cursor': 'pointer'}} onClick={() => {this.setState({listResults: false})}} />
    )

    if (this.state.listResults === true) {
      results = (
        <List
          finalAvailableHosts={finalAvailableHosts}
          numberOfCats={this.state.numberOfCats}
          checkInDate={this.state.checkInDate}
          checkOutDate={this.state.checkOutDate}
        />
      )
    } else {
      results = (
        <Map />
      )
    }


    return (
      <>
        <div style={{ 'height': '25vh', 'margin': '0', 'paddingLeft': '10vw', 'paddingRight': '10vw', 'paddingBottom': '2rem', 'paddingTop': '2rem', 'position': 'fixed', 'top': '10vh', 'overflow': 'hidden', 'background': 'white', 'width': '100%', 'zIndex': '100', 'boxShadow': '0 0 20px -5px rgba(0,0,0,.2)' }}>
          <div style={{'width': 'min-content', 'margin': 'auto'}}>
            <p style={{ 'color': '#c90c61', 'textAlign': 'left' }}>
              <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
              &nbsp;{this.state.location}&ensp;
              <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 236.62 236.62'><path d='M197.023,225.545c-1.145-9.533-11.68-10.614-17.805-9.958c-6.521-24.554,16.225-61.151,17.563-69.82c1.438-9.312-6.658-63.5-7.513-90.938C188.389,26.662,147.48-4.433,140.65,0.524c-6.768,7.484,9.748,17.585,1.054,26.245c-8.398,8.367-10.588,13.99-16.824,23.46c-15.976,24.255,27.318,24.558,27.318,24.558s-33.882,25.112-41.421,37.768c-6.943,11.656-9.854,24.696-18.232,35.688c-19.094,25.051-14.791,68.729-14.791,68.729s-36.17-11.839-16.264-53.133C76.643,132.406,84.107,86.02,50.016,97.95c-13.189,4.616,2.949,14.325,5.734,17.435c9.318,10.4,1.441,27.896-4.174,38.012c-15.037,27.091-20.496,55.475,11.154,72.978c14.063,7.776,33.055,9.7,52.17,9.982l48.64,0.14C179.564,237.294,197.689,234.298,197.023,225.545z' /></svg>
              &nbsp;{this.state.numberOfCats}&ensp;
              <strong style={{ 'color': 'grey', 'textAlign': 'right', 'fontSize': 'small' }}>
                  {finalAvailableHosts.length} result(s)
              </strong>
            </p>

            <Form style={{ 'padding': '0', 'width': '100%' }}>
              <Form.Group inline unstackable style={{ 'padding': '0', 'justifyContent': 'space-between', 'margin': 'auto', 'min-width': '258px' }}>
                <Form.Input
                  iconPosition='left'
                  style={{ 'maxWidth': '125px', 'marginRight': '-1rem' }}
                  readOnly
                  value={inDate}
                  icon={<Icon fitted name='arrow right' style={{ 'color': '#c90c61' }} />}
                />
                <Form.Input
                  iconPosition='left'
                  style={{ 'maxWidth': '125px', 'marginRight': '-1rem' }}
                  readOnly
                  value={outDate}
                  icon={<Icon fitted name='arrow left' style={{ 'color': '#c90c61' }} />}
                />
              </Form.Group>
            </Form>
          </div>
        </div>

        <Container style={{ 'background': '#ECECEC', 'height': '100vh', 'padding': '2rem', 'paddingTop': '1rem', 'marginTop': '25vh' }}>
          <div style={{'display': 'flex', 'flexDirection': 'row', 'paddingBottom': '1rem'}}>       
            {listButton}
            {mapButton}
          </div>

          {results}
        </Container>
      </>
    )
  }
}

const mapStateToProps = state => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
})

export default connect(mapStateToProps)(SearchResults)
