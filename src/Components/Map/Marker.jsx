import React from 'react'
import PropTypes from 'prop-types'
import { Label } from 'semantic-ui-react'

class Marker extends React.PureComponent {

  static defaultProps = {
    inGroup: false,
  }

  render() {
    let total = this.props.total
    let totalWithDecimals = +total.toFixed(2)

    return (
      <Label
        pointing='below'
        style={{ 'backgroundColor': '#c90c61', 'color': '#ffffff', 'transform': 'translate(-50%, -50%)' }}
        id={this.props.id}
        onClick={this.props.handleDatapointClick}
      >
        {totalWithDecimals}&nbsp;kr
      </Label>
    )
  }
}

Marker.propTypes = { inGroup: PropTypes.bool }

export default Marker
