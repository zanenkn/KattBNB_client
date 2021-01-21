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

   
          <Marker
            key={this.props.points[0].properties.id}
            lat={this.props.points[0].geometry.coordinates[1]}
            lng={this.props.points[0].geometry.coordinates[0]}
            id={this.props.points[0].properties.id}
            total={this.props.points[0].properties.total}
            available={true}
            handleDatapointClick={this.props.onLabelClick}
            cluster={true}
            pointCount={this.props.pointCount}
          />


    );
  }
}

ClusterMarker.propTypes = {
  points: PropTypes.array,
  users: PropTypes.instanceOf(List),
  selected: PropTypes.bool,
};

export default ClusterMarker;
