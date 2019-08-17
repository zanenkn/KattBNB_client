import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class UserPage extends Component {
  render () {
    let profile
    if(this.props.currentUserIn) {
      profile = (
          <p>
          yay.
          </p>
      )
    } else {
      return <Redirect to='/login' />
    }
    return (
      <>
        {profile}
      </>
    )
  }
}


const mapStateToProps = state => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
})

export default connect(mapStateToProps)(UserPage)