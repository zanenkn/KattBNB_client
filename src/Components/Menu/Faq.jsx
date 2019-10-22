import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import WIP from '../ReusableComponents/WorkInProgress'

class Faq extends Component {

  render() {

    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          FAQ
        </Header>
        <WIP />
      </div>
    )
  }
}

export default Faq
