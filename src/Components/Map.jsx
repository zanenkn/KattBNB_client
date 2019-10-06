import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { getBookingLength, bookingSearch } from '../Modules/booking'
import RetailerMap from 'react-retailer-map'
import 'react-retailer-map/lib/styles/retailer-map.scss'

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

  render() {
    let finalAvailableHosts = []
    let bookingLength = parseFloat(getBookingLength(this.props.checkInDate, this.props.checkOutDate))
    const googleMapURL = `https://maps.googleapis.com/maps/api/js?v=3&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&language=en&region=BH&libraries=geometry,drawing,places`
    const retailers = [
      {
        id: 1,
        location: "Example 1",
        coordinates: {
          lat: 26.178696,
          lng: 50.552151
        }
      }
    ]

    if (this.state.searchData !== '' && this.state.searchData.length > 0) {
      let availableByDate = bookingSearch(this.state.searchData, this.props.checkInDate, this.props.checkOutDate)
      availableByDate.map(host => {
        if (host.max_cats_accepted >= this.props.numberOfCats && this.props.id !== host.user.id) {
          finalAvailableHosts.push(host)
        }
      })
    }


    return (
      <div id='map'>
        <RetailerMap retailers={retailers} geolocate={true} color="#f00" countryCode="BH" googleMapURL={googleMapURL} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
})

export default connect(mapStateToProps)(Map)
