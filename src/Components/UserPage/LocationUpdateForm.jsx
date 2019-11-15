import React, { Component } from 'react'
import { LOCATION_OPTIONS } from '../../Modules/locationData'
import axios from 'axios'
import { Form, Dropdown, Button, Message, Divider } from 'semantic-ui-react'

class LocationUpdateForm extends Component {

  state = {
    newLocation: '',
    loading: false,
    errorDisplay: false,
    errors: ''
  }

  listenEnterKeyLocation = (event) => {
    if (event.key === 'Enter') {
      this.updateLocation(event)
    }
  }

  handleLocationChange = (e, { value }) => {
    this.setState({ newLocation: value })
  }

  updateLocation = (e) => {
    let address = this.props.fullAddress
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else if (this.state.newLocation === this.props.location || this.state.newLocation === '') {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['No location selected or location is unchanged!']
      })
    } else if (address !== '' && address.includes(this.state.newLocation) === false) {
      if (window.confirm('It seems that the location you selected does not match your host profile address. Are you sure you want to continue?')) {
        this.setState({ loading: true })
        e.preventDefault()
        const path = '/api/v1/auth/'
        const payload = {
          location: this.state.newLocation,
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        axios.put(path, payload)
          .then(() => {
            this.setState({
              loading: false,
              errorDisplay: false,
              errors: ''
            })
            window.alert('Location succesfully changed!')
            window.location.reload()
          })
          .catch(error => {
            this.setState({
              loading: false,
              errorDisplay: true,
              errors: error.response.data.errors.full_messages
            })
          })
      }
    } else {
      this.setState({ loading: true })
      e.preventDefault()
      const path = '/api/v1/auth/'
      const payload = {
        location: this.state.newLocation,
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload)
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false,
            errors: ''
          })
          window.alert('Location succesfully changed!')
          window.location.reload()
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    }
  }

  render() {
    let errorDisplay, locationSubmitButton

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative style={{ 'width': 'inherit' }} >
          <Message.Header textAlign='center'>Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.loading) {
      locationSubmitButton = (
        <Button id='location-submit-button' className='submit-button' loading>Change</Button>
      )
    } else {
      locationSubmitButton = (
        <Button id='location-submit-button' className='submit-button' onClick={this.updateLocation}>Change</Button>
      )
    }

    return (
      <>
        <Divider />
        <Form style={{ 'maxWidth': '194px' }}>
          <Dropdown
            clearable
            search
            selection
            placeholder='Select new location'
            options={LOCATION_OPTIONS}
            id='location'
            style={{ 'width': '100%' }}
            onChange={this.handleLocationChange}
            onKeyPress={this.listenEnterKeyLocation}
          />
          {errorDisplay}
        </Form>
        <div className='button-wrapper'>
          <Button secondary className='cancel-button' onClick={this.props.closeLocationAndPasswordForms}>Close</Button>
          {locationSubmitButton}
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  }
}

export default LocationUpdateForm
