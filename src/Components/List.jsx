import React, { Component } from 'react'
import { Container, Header } from 'semantic-ui-react'

class List extends Component {


  render() {
    let searchMessage

    if (this.props.finalAvailableHosts.length === 0) {
      searchMessage = (
        <Header>
          Your search did not yield any results! Try changing your search criteria or go to the map to find cat sitters in nearby areas.
        </Header>
      )
    }


    return (
      <Container style={{ 'background': '#ECECEC', 'height': '100vh' }}>
        {searchMessage}
      </Container>
    )
  }
}

export default List
