import React from 'react'
import GoogleMapReact from 'google-map-react'
import supercluster from 'points-cluster'
import Marker from './Marker'
import ClusterMarker from './ClusterMarker'
import mapStyles from '../Modules/MapStyle.js'
import Popup from 'reactjs-popup'
import HostPopup from './HostPopup'

export class GoogleMap extends React.PureComponent {
  state = {
    mapOptions: {
      center: {
        lat: this.props.mapCenterLat,
        lng: this.props.mapCenterLong
      },
      zoom: 12,
    },
    clusters: [],
    openHostPopup: false
  }

  getClusters = () => {
    const clusters = supercluster(this.props.allAvailableHosts, {
      minZoom: 0,
      maxZoom: 16,
      radius: 20,
    })
    return clusters(this.state.mapOptions)
  }

  createClusters = props => {
    this.setState({
      clusters: this.state.mapOptions.bounds
        ? this.getClusters(props).map(({ wx, wy, numPoints, points }) => ({
          lat: wy,
          lng: wx,
          numPoints,
          id: `${numPoints}_${points[0].id}`,
          points,
        }))
        : [],
    })
  }

  handleMapChange = ({ center, zoom, bounds }) => {
    this.setState(
      {
        mapOptions: {
          center,
          zoom,
          bounds,
        },
      },
      () => {
        this.createClusters(this.props)
      }
    )
  }

  handleDatapointClick = (e) => {
    const id = e.target.id
    this.setState({ id: id, openHostPopup: true })
  }

  closeModal = () => {
    this.setState({ openHostPopup: false })
  }

  render() {
    return (
      <div style={{ 'width': '100%', 'height': '100%' }}>
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
            />
          </div>
        </Popup>

        <GoogleMapReact
          defaultCenter={{lat: 59.330651, lng: 18.068562}}
          center={this.state.mapOptions.center}
          defaultZoom={12}
          options={{ styles: mapStyles }}
          onChange={this.handleMapChange}
          yesIWantToUseGoogleMapApiInternals
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
        >
          {this.state.clusters.map(item => {
            if (item.numPoints === 1) {
              return (
                <Marker
                  key={item.id}
                  id={item.points[0].id}
                  lat={item.points[0].lat}
                  lng={item.points[0].lng}
                  total={item.points[0].total}
                  handleDatapointClick={this.handleDatapointClick.bind(this)}
                />
              )
            }
            return (
              <ClusterMarker
                key={item.id}
                lat={item.lat}
                lng={item.lng}
                points={item.points}
              />
            )
          })}
        </GoogleMapReact>
      </div>
    )
  }
}

export default GoogleMap
