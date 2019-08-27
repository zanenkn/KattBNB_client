import React, { Component } from 'react'
import axios from 'axios'

class HostProfile extends Component {
  state = {
    description: '',
    full_address: '',
    rate: '',
    maxCats: '',
    supplement: '',
    availability: '',
    errors: '',
    errorDisplay: false
  }

  componentDidMount() {
    const path = `/api/v1/host_profiles/${this.props.id}`
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    axios.get(path, { headers: headers })
      .then(response => {
        window.localStorage.setItem('client', response.headers.client)
        window.localStorage.setItem('access-token', response.headers['access-token'])
        window.localStorage.setItem('expiry', response.headers.expiry)
        this.setState({
          description: response.data.description,
          full_address: response.data.full_address,
          rate: response.data.price_per_day_1_cat,
          maxCats: response.data.max_cats_accepted,
          supplement: response.data.supplement_price_per_cat_per_day,
          availability: response.data.availability
        })
      })
      .catch(error => {
        window.localStorage.setItem('client', error.response.headers.client)
        window.localStorage.setItem('access-token', error.response.headers['access-token'])
        window.localStorage.setItem('expiry', error.response.headers.expiry)
        this.setState({
          errorDisplay: true,
          errors: error.response.data.errors.full_messages
        })
      })
  }

  render() {
    return (
      <>
      {this.state.description}
      </>
    )
  }
}

export default HostProfile