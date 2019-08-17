import React, { Component } from 'react'
import { Sidebar, Header, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'

class SignupSuccess extends Component {

  render() {

    if (this.props.currentUserIn) {
      window.localStorage.clear()
      setTimeout(function () { window.location.reload(true) }, 1000)
    }

    return (
      <Sidebar.Pushable className='content-wrapper' >

        <Header as='h1'>
          Successful signup!
        </Header>

        <Segment className='whitebox' textAlign='center'>
          <p>
            Welcome, you have successfully signed up for KattBNB! You will need to confirm your email address in order to log in and start using our services. To continue, please follow the instructions we have sent to your email.
          </p>
        </Segment>
      </Sidebar.Pushable>
    )
  }
}


const mapStateToProps = state => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
})

export default connect(mapStateToProps)(SignupSuccess)
