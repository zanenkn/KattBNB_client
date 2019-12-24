import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import mapStyles from '../../Modules/MapStyle.js'
import { Header, Icon } from 'semantic-ui-react'

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
    let underMapText, options, marker, googleMapsLink

    googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${parseFloat(this.props.lat)},${parseFloat(this.props.long)}`

    if (this.props.address === undefined) {
      underMapText = (
        <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
          This is the approximate area of <strong style={{ 'color': '#c90c61' }}>{this.props.nickname}</strong>. You will receive the exact location when booking is confirmed.
        </p>
      )
      options = { scrollwheel: false, zoomControl: false, gestureHandling: 'none', styles: mapStyles }
    } else {
      underMapText = (
        <p style={{ 'margin': '1rem', 'textAlign': 'center' }}>
          <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
          &nbsp; <a href={googleMapsLink} target='_blank' rel='noopener noreferrer'>{this.props.address}</a>
        </p>
      )
      options = { scrollwheel: false, zoomControl: false, styles: mapStyles }

      marker = (
        <Icon
          name='map marker alternate'
          size='huge'
          style={{ 'color': '#c90c61' }}
          lat={parseFloat(this.props.lat)}
          lng={parseFloat(this.props.long)}
        />
      )
    }

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
            options={options}
            onChange={this.handleMapChange}
            yesIWantToUseGoogleMapApiInternals
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
          >
            {marker}
          </GoogleMapReact>
        </div>
        {underMapText}
      </>
    )
  }
}

export default HostLocationMap
