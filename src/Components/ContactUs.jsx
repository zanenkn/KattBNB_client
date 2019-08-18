import React, { Component } from 'react'
import { Sidebar, Header } from 'semantic-ui-react'
import WIP from './WorkInProgress'

class ContactUs extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          Contact us
        </Header>

        <WIP />

      </Sidebar.Pushable>
    )
  }
}

export default ContactUs
