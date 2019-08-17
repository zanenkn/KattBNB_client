import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Header, Segment } from 'semantic-ui-react'

class UserPage extends Component {
  render() {
    let profile
    if (this.props.currentUserIn) {
      profile = (
        <>
          <Segment className='whitebox'>
            <Header as='h2'>
              Hi, {this.props.username}!
            </Header>
            <p>
              yay.
            </p>
          </Segment>
        </>
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
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn,
  username: state.reduxTokenAuth.currentUser.attributes.username,
  location: state.reduxTokenAuth.currentUser.attributes.location
})

export default connect(mapStateToProps)(UserPage)