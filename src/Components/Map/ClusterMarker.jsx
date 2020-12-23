import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import Marker from './Marker';
import { Label } from 'semantic-ui-react';

class ClusterMarker extends React.PureComponent {
  state = {
    clusterFaceMarkers: this.props.points.slice(0, 1),
  };

  render() {
    return (
      <div style={{ display: 'flex', transform: 'translate(-50%, -50%)' }}>
        {this.state.clusterFaceMarkers.map((marker) => (
          <Marker key={marker.id} lat={marker.lat} lng={marker.lng} id={marker.id} total={marker.total} />
        ))}
        {this.props.points.length > 1 && (
          <Label
            circular
            style={{
              height: '2em',
              width: '2em',
              fontSize: 'x-small',
              backgroundColor: '#c90c61',
              color: '#ffffff',
              transform: 'translate(-350%, -200%)',
            }}
          >
            +{this.props.points.length - 1}
          </Label>
        )}
      </div>
    );
  }
}

ClusterMarker.propTypes = {
  points: PropTypes.array,
  users: PropTypes.instanceOf(List),
  selected: PropTypes.bool,
};

export default ClusterMarker;
