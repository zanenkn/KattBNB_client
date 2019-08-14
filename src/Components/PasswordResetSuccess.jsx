import React, { Component } from 'react'
import { Sidebar, Header, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'

class PasswordResetSuccess extends Component {

  render() {

    if (this.props.currentUserIn) {
      window.localStorage.clear()
      setTimeout(function () { window.location.reload(true) }, 1000)
    }

    return (
      <Sidebar.Pushable className='content-wrapper' >

        <Header as='h1'>
          Successful password reset request!
        </Header>

        <Segment className='whitebox' textAlign='center'>
          <p>
            You have successfully requested a password reset! To continue, please follow carefully the instructions in your email account. Remember to check your spum/junk folder. You can now close this window.
          </p>
        </Segment>
      </Sidebar.Pushable>
    )
  }
}


const mapStateToProps = state => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
})

export default connect(mapStateToProps)(PasswordResetSuccess)
