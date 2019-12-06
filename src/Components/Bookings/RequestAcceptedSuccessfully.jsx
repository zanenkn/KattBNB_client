import React, { Component } from 'react'

class RequestAcceptedSuccessfully extends Component {
  componentDidMount() {
    if (this.props.history.action === 'POP') {
      this.props.history.push({ pathname: '/' })
    }
  }

  render() {
    return (
      'yay'
    )
  }
}

export default RequestAcceptedSuccessfully