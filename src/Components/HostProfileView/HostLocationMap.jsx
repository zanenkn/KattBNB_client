import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import mapStyles from '../../Modules/MapStyle.js'
import { Header } from 'semantic-ui-react'

class HostLocationMap extends Component {

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 13
  }

  handleMapChange = ({ center, zoom, bounds }) => {
    this.setState(
      {
        mapOptions: {
          center,
          zoom,
          bounds,
        },
      }
    )
  }

  render() {

    return (
      <>
        <div style={{ 'width': '100%', 'height': '300px', 'overflow': 'hidden' }}>
          <Header as='h3' style={{ 'textAlign': 'left' }}>
            Location
          </Header>
          <GoogleMapReact
            defaultCenter={{ lat: 59.330651, lng: 18.068562 }}
            center={{ lat: parseFloat(this.props.lat), lng: parseFloat(this.props.long) }}
            defaultZoom={15}
            options={{ scrollwheel: false, zoomControl: false, gestureHandling: 'none', styles: mapStyles }}
            onChange={this.handleMapChange}
            yesIWantToUseGoogleMapApiInternals
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
          >
          </GoogleMapReact>
        </div>
        <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
          This is the approximate area of <strong style={{ 'color': '#c90c61' }}>{this.props.nickname}</strong>. You will receive the exact location when booking is confirmed.
        </p>
      </>
    )
  }
}

export default HostLocationMap
