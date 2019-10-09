import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import Marker from './Marker'
import { Label } from 'semantic-ui-react'


class ClusterMarker extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    clusterFaceMarkers: this.props.points.slice(0, 2),
  };

  render() {
    return (
      <div style={{'display': 'flex'}} >
        {this.state.clusterFaceMarkers.map(marker =>
          <Marker
            key={marker.id}
            lat={marker.lat}
            lng={marker.lng}
            name={marker.id}
            txt={marker.txt}
            inGroup
          />
        )}
        {this.props.points.length > 2 &&
          <Label circular color='teal' style={{'height': '2em', 'width': '2em', 'fontSize': 'x-small'}}>
            +{this.props.points.length - 2}
          </Label>}
      </div>
    );
  }
}

ClusterMarker.propTypes = {
  points: PropTypes.array,
  users: PropTypes.instanceOf(List),
  selected: PropTypes.bool,
};

export default ClusterMarker