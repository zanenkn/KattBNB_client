import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { getBookingLength, bookingSearch } from '../Modules/booking'

class Map extends Component {

  state = {
    searchData: ''
  }

  componentDidMount() {
    axios.get('/api/v1/host_profiles').then(response => {
      this.setState({
        searchData: response.data
      })
    })
  }

  render() {
    let finalAvailableHosts = []
    let bookingLength = parseFloat(getBookingLength(this.props.checkInDate, this.props.checkOutDate))

    if (this.state.searchData !== '' && this.state.searchData.length > 0) {
      let availableByDate = bookingSearch(this.state.searchData, this.props.checkInDate, this.props.checkOutDate)
      availableByDate.map(host => {
        if (host.max_cats_accepted >= this.props.numberOfCats && this.props.id !== host.user.id) {
          finalAvailableHosts.push(host)
        }
      })
    }


    return (
      <p id='map'>
        map
        {bookingLength}
      </p>
    )
  }
}

const mapStateToProps = state => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
})

export default connect(mapStateToProps)(Map)
