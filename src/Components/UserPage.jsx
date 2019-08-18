import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Form, Dropdown, Button, Message } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../Modules/locationData'
import axios from 'axios'

class UserPage extends Component {
  state = {
    displayLocationForm: false,
    displayPasswordForm: false,
    password: '',
    location: this.props.location,
    loading: false,
    errorDisplay: false,
    errors: ''
  }

  listenEnterKey = (event) => {
    if (event.key === "Enter") {
      this.createUser(event)
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleLocationChange = (e, { value }) => {
    this.setState({ location: value })
  }

  locationFormHandler = () => {
    this.setState ({
      displayLocationForm: !this.state.displayLocationForm,
      location: this.props.location,
      errorDisplay: false,
      password: ''
    })
  }

  updateLocation = (e) => {
    this.setState({ loading: true })
    e.preventDefault()
    const path = '/api/v1/auth/'
    const payload = {
      current_password: this.state.password,
      location: this.state.location,
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    axios.put(path, payload)
      .then(response => {
        window.localStorage.setItem('client', response.headers.client)
        window.localStorage.setItem('access-token', response.headers['access-token'])
        window.localStorage.setItem('expiry', response.headers.expiry)
        this.setState({
          displayLocationForm: false,
          location: response.data.data.location,
          loading: false
        })
      })
      .catch(error => {
        window.localStorage.setItem('client', error.response.headers.client)
        window.localStorage.setItem('access-token', error.response.headers['access-token'])
        window.localStorage.setItem('expiry', error.response.headers.expiry)
        this.setState({
          loading: false,
          errorDisplay: true,
          errors: error.response.data.errors.full_messages
        })
      })
  }
  

  render() {
    let errorDisplay

    let locationForm
    let locationSubmitButton

    let passwordForm

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>Location could not be updated because of following error(s):</Message.Header>
          <ul id="message-error-list">
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.loading) {
      locationSubmitButton = (
        <Button id="location-submit-button" loading>Change location</Button>
      )
    } else {
      locationSubmitButton = (
        <Button id="location-submit-button" onClick={this.updateLocation}>Change location</Button>
      )
    }

    if(this.state.displayLocationForm) {
      locationForm = (
        <>
        {errorDisplay}
        <Form>
          <Dropdown
            clearable
            search
            selection
            style={{ 'width': '100%' }}
            placeholder="Select new location"
            options={LOCATION_OPTIONS}
            id='location'
            onChange={this.handleLocationChange}
            onKeyPress={this.listenEnterKey}
          />

          <Form.Input
            required
            id='password'
            value={this.state.password}
            type='password'
            onChange={this.onChangeHandler}
            placeholder='Your password'
            onKeyPress={this.listenEnterKey}
          />
        </Form>

        {locationSubmitButton}

        <Button id="location-cancel-button" onClick={this.locationFormHandler.bind(this)}>Close</Button>

        </>

      )
    }

    return (
      <div className='content-wrapper'>
        <Segment className='whitebox'>
          <Header as='h2'>
            Hi, {this.props.username}!
            </Header>
          <p>
            This is your profile. Here you can update your location, picture and password.
          </p>
          <p>
            <svg height='1rem' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>
            &nbsp;{this.state.location}
          </p>
          <Header id='change-location-link' onClick={this.locationFormHandler.bind(this)} className='fake-link-underlined' >
            Change
          </Header>
          {locationForm}
          <p>
            <svg height='1rem' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" /></svg>
            &nbsp;******
          </p>
          <Header id='change-password-link' className='fake-link-underlined' >
            Change
          </Header>
        </Segment>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  location: state.reduxTokenAuth.currentUser.attributes.location
})

export default connect(mapStateToProps)(UserPage)
