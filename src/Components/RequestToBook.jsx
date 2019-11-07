import React, { Component } from 'react'
import { connect } from 'react-redux'

class RequestToBook extends Component {
  render() {
    return(
      'yay'
    )
  }
}

const mapStateToProps = state => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
})

export default connect(mapStateToProps)(RequestToBook)