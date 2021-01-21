import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';

class Marker extends React.PureComponent {
  static defaultProps = {
    inGroup: false,
  };

  render() {
    return (
      <div style={{ transform: this.props.cluster ? 'translate(calc(-50% + 30px), -50%)' : 'translate(-50%, -50%)', position: 'absolute', display: this.props.cluster ? 'flex' : 'block' }}>
        <Label
          pointing='below'
          style={{
            backgroundColor: this.props.available ? '#c90c61' : '#808080',
            color: '#ffffff',
          }}
          id={this.props.id}
          onClick={(e) => this.props.onClick(this.props.id, this.props.available)}
        >
          {this.props.total}&nbsp;kr
        </Label>
        {this.props.cluster &&
          <div

            style={{
              height: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '25px',
              fontSize: '10px',
              fontWeight: 'bold',
              backgroundColor: '#c90c61',
              color: '#ffffff',
              borderRadius: '9999px',
              marginLeft: '5px',

            }}
          >
            +{this.props.pointCount - 1}
          </div>}
      </div>
    );
  }
}

Marker.propTypes = { inGroup: PropTypes.bool };

export default Marker;
