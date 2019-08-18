import React, { Component } from 'react'
import { Sidebar, Header } from 'semantic-ui-react'
import WIP from './WorkInProgress'

class SignUp extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          About us
        </Header>

        <WIP />

      </Sidebar.Pushable>
    )
  }
}

export default SignUp