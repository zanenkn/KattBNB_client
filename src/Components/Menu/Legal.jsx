import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import WIP from '../ReusableComponents/WorkInProgress'

class Legal extends Component {
  render() {
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          Legal
        </Header>

        <WIP />

      </div>
    )
  }
}

export default Legal
