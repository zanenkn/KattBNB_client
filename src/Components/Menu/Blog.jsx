import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import WIP from '../ReusableComponents/WorkInProgress'

class Blog extends Component {

  render() {

    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          Blog
        </Header>
        <WIP />
      </div>
    )
  }
}

export default Blog
