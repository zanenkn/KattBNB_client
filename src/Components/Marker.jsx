import React from 'react'
import PropTypes from 'prop-types'
import { Label } from 'semantic-ui-react'


class Marker extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  static defaultProps = {
    inGroup: false,
  };

  render() {
    return (
      <Label 
      pointing='below'
      color='teal'
      >
        {this.props.txt}
      </Label>
    );
  }
}

Marker.propTypes = {
  inGroup: PropTypes.bool,
};

export default Marker
