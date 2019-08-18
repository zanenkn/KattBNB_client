import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import WIP from './WorkInProgress'

class ContactUs extends Component {
  render() {
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          Contact us
        </Header>

        <WIP />

      </div>
    )
  }
}

export default ContactUs
