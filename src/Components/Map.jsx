import React, { Component } from 'react'
import axios from 'axios'
import { Label } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getBookingLength, bookingSearch } from '../Modules/booking'
import GoogleMapReact from 'google-map-react'
import MapStyle from '../Modules/MapStyle'

class Map extends Component {

  static defaultProps = {
    center: {
      lat: 59.330651,
      lng: 18.068562
    },
    zoom: 11
  }

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

    if (this.state.searchData !== '' && this.state.searchData.length > 0) {
      let availableByDate = bookingSearch(this.state.searchData, this.props.checkInDate, this.props.checkOutDate)
      availableByDate.map(host => {
        if (host.max_cats_accepted >= this.props.numberOfCats && this.props.id !== host.user.id) {
          finalAvailableHosts.push(host)
        }
      })
    }


    return (
      //<div id='map'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          options={{ styles: MapStyle }}
          //onClick={this.hideElements}
        >

          {finalAvailableHosts.map(host => (
            
            <Label pointing='below'
              color='teal'
              lat={parseFloat(host.lat)}
              lng={parseFloat(host.long)}
              key={host.id}
              id={host.user.id}
              //onClick={this.handleDatapointClick}
              //className={this.setDatapointColor(post)} 
              >
                
                {parseFloat(parseFloat(host.price_per_day_1_cat) + (parseFloat(this.props.numberOfCats) - 1) * parseFloat(host.supplement_price_per_cat_per_day)) * parseFloat(getBookingLength(this.props.checkInDate, this.props.checkOutDate))}&nbsp;kr
              
                
              </Label>
          ))}

        </GoogleMapReact>



      //</div>
    )
  }
}

const mapStateToProps = state => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
})

export default connect(mapStateToProps)(Map)
