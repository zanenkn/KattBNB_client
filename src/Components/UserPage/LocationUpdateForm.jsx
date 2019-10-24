import React, { Component } from 'react'
import { LOCATION_OPTIONS } from '../../Modules/locationData'
import axios from 'axios'
import { Form, Dropdown, Button, Message, Divider } from 'semantic-ui-react'

class LocationUpdateForm extends Component {

  state = {
    location: '',
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
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else if (this.state.newLocation === this.state.location || this.state.newLocation === '') {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['No location selected or location is unchanged!']
      })
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
        .then(response => {
          this.setState({
            displayLocationForm: false,
            location: response.data.data.location,
            loading: false,
            errorDisplay: false
          })
          if (this.state.hostProfile.length === 1) {
            window.alert('Location succesfully changed!')
          } else {
            window.alert('Location succesfully changed!')
            window.location.reload()
          }
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
          <Button secondary className='cancel-button' onClick={this.locationFormHandler}>Close</Button>
          {locationSubmitButton}
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  }
}

export default LocationUpdateForm
