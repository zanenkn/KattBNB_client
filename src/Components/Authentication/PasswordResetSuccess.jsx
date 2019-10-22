import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'

class PasswordResetSuccess extends Component {

  render() {

    if (this.props.currentUserIn) {
      window.localStorage.clear()
      setTimeout(function () { window.location.reload(true) }, 500)
    }

    return (
      <div className='content-wrapper' >

        <Header as='h1'>
          Successful password reset request!
        </Header>

        <Segment className='whitebox' textAlign='center'>
          <p>
            You have successfully requested a password reset! To continue, please follow the instructions we have sent to your email.
          </p>
        </Segment>
      </div>
    )
  }
}


const mapStateToProps = state => ({ currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn })

export default connect(mapStateToProps)(PasswordResetSuccess)
