import React, { Component } from 'react'
import { Sidebar, Header } from 'semantic-ui-react'
import WIP from './WorkInProgress'

class Legal extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          Legal
        </Header>
        
        <WIP />

      </Sidebar.Pushable>
    )
  }
}

export default Legal
