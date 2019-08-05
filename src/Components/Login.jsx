import React, { Component } from 'react'
import { Sidebar, Header } from 'semantic-ui-react'
import WIP from './WorkInProgress'

class Login extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          Log in
        </Header>
        
        <WIP />
        
      </Sidebar.Pushable>
    )
  }
}

export default Login
