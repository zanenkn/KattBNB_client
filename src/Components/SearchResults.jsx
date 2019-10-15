import React, { Component } from 'react'
import { Form, Icon, Container, Grid, Header } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Geocode from 'react-geocode'
import { bookingSearch, getBookingLength } from '../Modules/booking'
import List from './List'
import GoogleMap from './GoogleMap'
import HostProfileView from './HostProfileView'
import moment from 'moment'
import axios from 'axios'
import Popup from 'reactjs-popup'
import HostPopup from './HostPopup'

class SearchResults extends Component {
  state = {
    id: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfCats: '',
    location: '',
    locationLat: '',
    locationLong: '',
    searchDataLocation: '',
    results: 'list',
    openHostPopup: false
  }

  geolocationDataAddress = () => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE)
    Geocode.fromAddress(this.props.history.location.state.location).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location
        this.setState({
          locationLat: lat,
          locationLong: lng
        })
      }
    )
  }

  componentDidMount() {
    if (this.props.history.location.state === undefined) {
      this.props.history.push({ pathname: '/' })
    } else {
      let allAvailableHosts = []
      axios.get('/api/v1/host_profiles').then(response => {
        if (response.data !== '' && response.data.length > 0) {
          let availableByDate = bookingSearch(response.data, this.props.history.location.state.from, this.props.history.location.state.to)
          availableByDate.map(host => {
            if (host.max_cats_accepted >= this.props.history.location.state.cats && this.props.id !== host.user.id) {
              let total = parseFloat(parseFloat(host.price_per_day_1_cat) + (parseFloat(this.props.history.location.state.cats) - 1) * parseFloat(host.supplement_price_per_cat_per_day)) * parseFloat(getBookingLength(this.props.history.location.state.from, this.props.history.location.state.to))
              allAvailableHosts.push(
                {
                  id: host.user.id,
                  lat: parseFloat(host.lat),
                  lng: parseFloat(host.long),
                  total: total
                }
              )
            }
          })
        }
      })
      this.setState({
        checkInDate: this.props.history.location.state.from,
        checkOutDate: this.props.history.location.state.to,
        numberOfCats: this.props.history.location.state.cats,
        location: this.props.history.location.state.location,
        searchDataLocation: this.props.history.location.state.searchData,
        allAvailableHosts: allAvailableHosts
      })
      this.geolocationDataAddress()
    }
  }

  handleHostProfileClick() {
    this.setState({ results: 'profile', openHostPopup: false })
  }

  async handleDatapointClick(e) {
    axios.get(`/api/v1/host_profiles?user_id=${e.target.id}`).then(response => {
      this.setState({
        hostAvatar: response.data[0].user.avatar,
        hostNickname: response.data[0].user.nickname,
        hostLocation: response.data[0].user.location,
        hostRate: response.data[0].price_per_day_1_cat,
        hostSupplement: response.data[0].supplement_price_per_cat_per_day,
        hostDescription: response.data[0].description,
        hostLat: response.data[0].lat,
        hostLong: response.data[0].long,
        openHostPopup: true
      })
    })
  }

  closeModal = () => {
    this.setState({ openHostPopup: false })
  }

  render() {
    let inDate = moment(this.state.checkInDate).format('ll')
    let outDate = moment(this.state.checkOutDate).format('ll')
    let finalAvailableHosts = []
    let listButton
    let mapButton
    let mapButtonStyle
    let listButtonStyle
    let resultCounter
    let results

    if (this.state.searchDataLocation !== '' && this.state.searchDataLocation.length > 0) {
      let availableByDate = bookingSearch(this.state.searchDataLocation, this.state.checkInDate, this.state.checkOutDate)
      availableByDate.map(host => {
        if (host.max_cats_accepted >= this.state.numberOfCats && this.props.id !== host.user.id) {
          finalAvailableHosts.push(host)
        }
      })
    }

    switch (this.state.results) {
      case 'list':
        results = (
          <Container style={{ 'background': '#ECECEC', 'minHeight': '64vh', 'marginTop': '26vh' }}>
            <List
              finalAvailableHosts={finalAvailableHosts}
              numberOfCats={this.state.numberOfCats}
              checkInDate={this.state.checkInDate}
              checkOutDate={this.state.checkOutDate}
            />
          </Container>
        )
        mapButtonStyle = ({ 'backgroundColor': 'grey', 'cursor': 'pointer' })
        listButtonStyle = ({ 'backgroundColor': '#c90c61', 'cursor': 'pointer' })
        resultCounter = (`${finalAvailableHosts.length} result(s)`)
        break
      case 'map':
        results = (
          <Container style={{ 'background': '#ECECEC', 'height': '64vh', 'marginTop': '26vh' }}>
            <GoogleMap
              numberOfCats={this.state.numberOfCats}
              checkInDate={this.state.checkInDate}
              checkOutDate={this.state.checkOutDate}
              mapCenterLat={this.state.locationLat}
              mapCenterLong={this.state.locationLong}
              allAvailableHosts={this.state.allAvailableHosts}
              handleDatapointClick={this.handleDatapointClick.bind(this)}
            />
          </Container>
        )
        mapButtonStyle = ({ 'backgroundColor': '#c90c61', 'cursor': 'pointer' })
        listButtonStyle = ({ 'backgroundColor': 'grey', 'cursor': 'pointer' })
        resultCounter = (`${finalAvailableHosts.length} result(s)`)
        break
      case 'profile':
        results = (
          <Container style={{ 'minHeight': '64vh', 'marginTop': '26vh' }}>
            <HostProfileView
              numberOfCats={this.state.numberOfCats}
              checkInDate={this.state.checkInDate}
              checkOutDate={this.state.checkOutDate}
              id={this.state.id}
              avatar={this.state.hostAvatar}
              nickname={this.state.hostNickname}
              location={this.state.hostLocation}
              rate={this.state.hostRate}
              supplement={this.state.hostSupplement}
              description={this.state.hostDescription}
              lat={this.state.hostLat}
              long={this.state.hostLong}
            />
          </Container>
        )
        mapButtonStyle = ({ 'backgroundColor': 'grey', 'cursor': 'pointer' })
        listButtonStyle = ({ 'backgroundColor': 'grey', 'cursor': 'pointer' })
        resultCounter = (
          <Header
            onClick={() => {this.setState({results: 'list'})} } 
            className='fake-link-underlined'
            style={{ 'textAlign': 'right' }}
          >
            Back to results
          </Header>
        )
        break
    }

    listButton = (
      <Icon id='list-button' name='list' circular inverted style={listButtonStyle} onClick={() => { this.setState({ results: 'list' }) }} />
    )

    mapButton = (
      <Icon id='map-button' name='map' circular inverted style={mapButtonStyle} onClick={() => { this.setState({ results: 'map' }) }} />
    )

    return (
      <>
        <Popup
          modal
          open={this.state.openHostPopup}
          closeOnDocumentClick={true}
          onClose={this.closeModal}
          position="top center"
        >
          <div>
            <HostPopup
              id={this.state.id}
              numberOfCats={this.state.numberOfCats}
              checkInDate={this.state.checkInDate}
              checkOutDate={this.state.checkOutDate}
              avatar={this.state.hostAvatar}
              nickname={this.state.hostNickname}
              location={this.state.hostLocation}
              rate={this.state.hostRate}
              supplement={this.state.hostSupplement}
              handleHostProfileClick={this.props.handleHostProfileClick}
              handleHostProfileClick={this.handleHostProfileClick.bind(this)}
            />
          </div>
        </Popup>
        <div style={{ 'height': '26vh', 'margin': '0', 'paddingLeft': '10vw', 'paddingRight': '10vw', 'paddingBottom': '1rem', 'paddingTop': '1rem', 'position': 'fixed', 'top': '10vh', 'overflow': 'hidden', 'background': 'white', 'width': '100%', 'zIndex': '100', 'boxShadow': '0 0 20px -5px rgba(0,0,0,.2)' }}>
          <div style={{ 'width': 'min-content', 'margin': 'auto' }}>
            <p style={{ 'color': '#c90c61', 'textAlign': 'left' }}>
              <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
              &nbsp;{this.state.location}&emsp;
              <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 236.62 236.62'><path d='M197.023,225.545c-1.145-9.533-11.68-10.614-17.805-9.958c-6.521-24.554,16.225-61.151,17.563-69.82c1.438-9.312-6.658-63.5-7.513-90.938C188.389,26.662,147.48-4.433,140.65,0.524c-6.768,7.484,9.748,17.585,1.054,26.245c-8.398,8.367-10.588,13.99-16.824,23.46c-15.976,24.255,27.318,24.558,27.318,24.558s-33.882,25.112-41.421,37.768c-6.943,11.656-9.854,24.696-18.232,35.688c-19.094,25.051-14.791,68.729-14.791,68.729s-36.17-11.839-16.264-53.133C76.643,132.406,84.107,86.02,50.016,97.95c-13.189,4.616,2.949,14.325,5.734,17.435c9.318,10.4,1.441,27.896-4.174,38.012c-15.037,27.091-20.496,55.475,11.154,72.978c14.063,7.776,33.055,9.7,52.17,9.982l48.64,0.14C179.564,237.294,197.689,234.298,197.023,225.545z' /></svg>
              &nbsp;{this.state.numberOfCats}
            </p>

            <Form style={{ 'padding': '0', 'width': '100%' }}>
              <Form.Group inline unstackable style={{ 'padding': '0', 'justifyContent': 'space-between', 'margin': 'auto', 'minWidth': '258px' }}>
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
            <Grid columns={2} style={{ 'display': 'flex', 'flexDirection': 'row', 'marginTop': '1rem', 'marginLeft': 'auto', 'marginRight': 'auto' }}>
              <Grid.Column width={8} style={{ 'padding': '0' }}>
                {listButton}
                {mapButton}
              </Grid.Column>
              <Grid.Column width={8} style={{ 'padding': '0', 'textAlign': 'right', 'alignContent': 'center', 'display': 'grid' }}>
                <strong style={{ 'color': 'grey', 'fontSize': 'small' }}>
                  {resultCounter}
                </strong>
              </Grid.Column>
            </Grid>
          </div>
        </div>
        {results}
      </>
    )
  }
}

const mapStateToProps = state => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
})

export default connect(mapStateToProps)(SearchResults)
