import React, { Component } from 'react'
import { Sidebar, Header, Segment } from 'semantic-ui-react'
import WIP from './WorkInProgress'

class SignUp extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          Sign up
        </Header>
        
        <WIP />

        <Segment>
          lorem ipsum dolor
        </Segment>

      </Sidebar.Pushable>
    )
  }
}

export default SignUp
