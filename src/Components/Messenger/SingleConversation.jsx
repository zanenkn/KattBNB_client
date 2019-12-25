import React, { Component } from 'react'

class Conversation extends Component {
  render() {
    return(
      <>
      {this.props.location.state.id}
      </>
    )
  }
}

export default Conversation