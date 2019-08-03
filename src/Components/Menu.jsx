import React, { Component } from 'react'
import { Sidebar, Segment } from 'semantic-ui-react'

class Menu extends Component {
  render() {
    return(
      <Sidebar
        id='menu'
        as={Segment}
        animation='overlay'
        direction='left'
        visible={this.props.visible}
      >
      <h1>
        Menu, yo!
      </h1>
      </Sidebar>
    )
  }
}

export default Menu