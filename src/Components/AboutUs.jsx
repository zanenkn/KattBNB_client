import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import WIP from './WorkInProgress'

class AboutUs extends Component {
  render() {
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          About us
        </Header>

        <WIP />

      </div>
    )
  }
}

export default AboutUs
