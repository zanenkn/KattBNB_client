import React from 'react'
import PropTypes from 'prop-types'
import { Label } from 'semantic-ui-react'


class Marker extends React.PureComponent {
  static defaultProps = {
    inGroup: false,
  }

  render() {

    return (
      <Label
        pointing='below'
        style={{ 'backgroundColor': '#c90c61', 'color': '#ffffff' }}
        id={this.props.id}
      >
        {this.props.total}&nbsp;kr
      </Label>
    )
  }
}

Marker.propTypes = {
  inGroup: PropTypes.bool,
}

export default Marker
