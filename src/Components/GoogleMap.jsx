import React from 'react'
import GoogleMapReact from 'google-map-react'
import supercluster from 'points-cluster'
import Marker from './Marker'
import ClusterMarker from './ClusterMarker'
import mapStyles from '../Modules/MapStyle.js'
import axios from 'axios'

const MAP = {
  defaultZoom: 8,
  defaultCenter: {
    lat: 59.330651,
    lng: 18.068562
  },
  options: {
    styles: mapStyles,
    maxZoom: 19,
  },
};

export class GoogleMap extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    mapOptions: {
      center: MAP.defaultCenter,
      zoom: MAP.defaultZoom,
    },
    clusters: [],
  };

  componentDidMount() {
    let array = []
    axios.get('https://what-are-you-looking-at.herokuapp.com/api/v1/host_profiles').then(response => {
      response.data.map(host => {
          array.push(
            {
              id: host.id,
              lat: parseFloat(host.lat),
              lng: parseFloat(host.long),
              txt: host.price_per_day_1_cat
            } 
          )
      })
    })

    this.setState({
      markersData: array
    })
    
  }



  getClusters = () => {
    const clusters = supercluster(this.state.markersData, {
      minZoom: 0,
      maxZoom: 16,
      radius: 60,
    });

    return clusters(this.state.mapOptions);
  };

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
    });
  };

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
        this.createClusters(this.props);
      }
    );
  };

  render() {
    return (

      <div style={{'width': '100%', 'height': '100%'}}>
        <GoogleMapReact
          defaultZoom={MAP.defaultZoom}
          defaultCenter={MAP.defaultCenter}
          options={MAP.options}
          onChange={this.handleMapChange}
          yesIWantToUseGoogleMapApiInternals
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
        >
          {this.state.clusters.map(item => {
            if (item.numPoints === 1) {
              return (
                <Marker
                  key={item.id}
                  lat={item.points[0].lat}
                  lng={item.points[0].lng}
                  txt={item.points[0].txt}
                />
              );
            }

            return (
              <ClusterMarker
                key={item.id}
                lat={item.lat}
                lng={item.lng}
                points={item.points}
              />
            );
          })}
        </GoogleMapReact>
      </div>

    );
  }
}

export default GoogleMap;



// import React, { Component } from 'react'
// import axios from 'axios'
// import { Label } from 'semantic-ui-react'
// import { connect } from 'react-redux'
// import { getBookingLength, bookingSearch } from '../Modules/booking'
// import GoogleMapReact from 'google-map-react'
// import MapStyle from '../Modules/MapStyle'

// class Map extends Component {

//   state = {
//     searchData: ''
//   }

//   componentDidMount() {
//     axios.get('/api/v1/host_profiles').then(response => {
//       this.setState({
//         searchData: response.data
//       })
//     })
//   }

//   render() {
//     let finalAvailableHosts = []
//     let mapCenter

//     if (this.state.searchData !== '' && this.state.searchData.length > 0) {
//       let availableByDate = bookingSearch(this.state.searchData, this.props.checkInDate, this.props.checkOutDate)
//       availableByDate.map(host => {
//         if (host.max_cats_accepted >= this.props.numberOfCats && this.props.id !== host.user.id) {
//           finalAvailableHosts.push(host)
//         }
//       })
//     }

//     mapCenter = {
//       lat: this.props.mapCenterLat,
//       lng: this.props.mapCenterLong
//     }


//     return (
//       <GoogleMapReact
//         bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
//         defaultCenter={mapCenter}
//         defaultZoom={12}
//         options={{ styles: MapStyle }}
//       //onClick={this.hideElements}
//       >
//         {finalAvailableHosts.map(host => (
//           <Label pointing='below'
//             color='teal'
//             lat={parseFloat(host.lat)}
//             lng={parseFloat(host.long)}
//             key={host.id}
//             id={host.user.id}
//           //onClick={this.handleDatapointClick}
//           //className={this.setDatapointColor(post)} 
//           >
//             {parseFloat(parseFloat(host.price_per_day_1_cat) + (parseFloat(this.props.numberOfCats) - 1) * parseFloat(host.supplement_price_per_cat_per_day)) * parseFloat(getBookingLength(this.props.checkInDate, this.props.checkOutDate))}&nbsp;kr
//           </Label>
//         ))}
//       </GoogleMapReact>
//     )
//   }
// }


// const mapStateToProps = state => ({
//   id: state.reduxTokenAuth.currentUser.attributes.id,
// })

// export default connect(mapStateToProps)(Map)
