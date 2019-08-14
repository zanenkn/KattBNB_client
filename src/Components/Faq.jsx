import React, { Component } from 'react'
import { Sidebar, Header } from 'semantic-ui-react'
import WIP from './WorkInProgress'

class Faq extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          FAQ
        </Header>

        <WIP />

      </Sidebar.Pushable>
    )
  }
}

export default Faq
