import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

class SearchResults extends Component {

  
  render() {
    let searchMessage

    if (this.props.history.location.state.searchData.length === 0) {
      searchMessage = (
        <Header>
          Your search did not yield any results! Try changing your search criteria or go to the map to find cat sitters in nearby areas.
        </Header>
      )
    }


    return (
      <>
        {searchMessage}
      </>
    )
  }
}

export default SearchResults
