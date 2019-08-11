import React, { Component } from 'react'
import { Sidebar, Header, Segment } from 'semantic-ui-react'

class SignupSuccess extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        
        <Header as='h1'>
          Successful signup!
        </Header>

        <Segment className='whitebox' textAlign='center'>
          <p>
            Welcome, you have successfully signed up for KattBNB! You will need to confirm your email address in order to log in and start using our services. Just follow the steps in the email we have sent you to finalize the process.
          </p>
        </Segment>
      </Sidebar.Pushable>
    )
  }
}

export default SignupSuccess
