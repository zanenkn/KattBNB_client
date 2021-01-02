import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';

class Marker extends React.PureComponent {
  static defaultProps = {
    inGroup: false,
  };

  render() {
    return (
      <div style={{ transform: 'translate(-50%, -50%)' }}>
        <Label
          pointing='below'
          style={{ backgroundColor: this.props.available ? '#c90c61' : '#808080', color: '#ffffff', transform: 'translate(-50%, -50%)' }}
          id={this.props.id}
          onClick={this.props.handleDatapointClick}
        >
          {this.props.total}&nbsp;kr
        </Label>
      </div>
    );
  }
}

Marker.propTypes = { inGroup: PropTypes.bool };

export default Marker;
