import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

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
            You have successfully requested a password reset! To continue, please follow the instructions we have sent to your email. If you didn't receive our message in your inbox, please refer to our <Header as={Link} to='faq' className='fake-link'>FAQ</Header> section.
          </p>
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = state => ({ currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn })

export default connect(mapStateToProps)(PasswordResetSuccess)
