import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

class SearchResults extends Component {
  state = {
    checkInDate: '',
    checkOutDate: '',
    numberOfCats: '',
    location: '',
    searchDataLocation: ''
  }

  componentDidMount() {
    if (this.props.history.location.state === undefined) {
      this.props.history.push({ pathname: '/' })
    } else {
      this.setState({
        checkInDate: this.props.history.location.state.from,
        checkOutDate: this.props.history.location.state.to,
        numberOfCats: this.props.history.location.state.cats,
        location: this.props.history.location.state.location,
        searchDataLocation: this.props.history.location.state.searchData
      })
    }
  }


  render() {
    let searchMessage

    if (this.state.searchDataLocation !== '' && this.state.searchDataLocation.length === 0) {
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
