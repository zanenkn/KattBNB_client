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
            Welcome, you have successfully signed up for KattBNB! You will need to confirm your email address in order to log in and start using our services. Just follow the steps in the email we have sent you to finalize the process (remember to check your spum/junk folder). You can now close this window.
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
