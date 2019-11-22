import React from 'react'
import PropTypes from 'prop-types'
import { Label } from 'semantic-ui-react'

class Marker extends React.PureComponent {

  static defaultProps = {
    inGroup: false,
  }

  render() {
    let total = this.props.total
    let totalWithDecimalsString = total.toFixed(2)
    let finalTotal

    if (totalWithDecimalsString[totalWithDecimalsString.length - 1] === '0' && totalWithDecimalsString[totalWithDecimalsString.length - 2] === '0') {
      finalTotal = parseFloat(totalWithDecimalsString)
    } else {
      finalTotal = totalWithDecimalsString
    }

    return (
      <div style={{ 'transform': 'translate(-50%, -50%)' }}>
        <Label
          pointing='below'
          style={{ 'backgroundColor': '#c90c61', 'color': '#ffffff', 'transform': 'translate(-50%, -50%)' }}
          id={this.props.id}
          onClick={this.props.handleDatapointClick}
        >
          {finalTotal}&nbsp;kr
        </Label>
      </div>
    )
  }
}

Marker.propTypes = { inGroup: PropTypes.bool }

export default Marker
