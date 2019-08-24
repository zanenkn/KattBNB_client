import React, { Component } from 'react'
import HostProfileForm from './HostProfileForm'
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
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
    loading: false,
    errorDisplay: false,
    errors: '',
    host_profile: '',
    host_profile_form: false
  }

  componentDidMount() {
    axios.get(`/api/v1/host_profiles?user_id=${this.props.id}`).then(response => {
      this.setState({ host_profile: response.data })
    })
  }

  listenEnterKeyLocation = (event) => {
    if (event.key === "Enter") {
      this.updateLocation(event)
    }
  }

  listenEnterKeyPassword = (event) => {
    if (event.key === "Enter") {
      this.updatePassword(event)
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
    this.setState({
      displayLocationForm: !this.state.displayLocationForm,
      displayPasswordForm: false,
      location: this.props.location,
      errorDisplay: false,
      password: ''
    })
  }

  passwordFormHandler = () => {
    this.setState({
      displayPasswordForm: !this.state.displayPasswordForm,
      displayLocationForm: false,
      errorDisplay: false,
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    })
  }

  hostProfileFormHandler = () => {
    this.setState({
      host_profile_form: true
    })
  }

  updateLocation = (e) => {
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else {
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
          setTimeout(function () { alert('Location succesfully changed!') }, 1000)
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
  }

  updatePassword = (e) => {
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else if (this.state.new_password === this.state.new_password_confirmation && this.state.new_password.length >= 6) {
      this.setState({ loading: true })
      e.preventDefault()
      const path = '/api/v1/auth/password'
      const payload = {
        current_password: this.state.current_password,
        password: this.state.new_password,
        password_confirmation: this.state.new_password_confirmation,
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload)
        .then(() => {
          this.setState({
            displayPasswordForm: false,
            loading: false
          })
          window.location.replace('/login')
          window.localStorage.clear()
          window.alert('Your password was successfully changed!')
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
    } else {
      this.setState({
        errorDisplay: true,
        errors: ["Check that 'new password' fields are an exact match with each other and that they consist of at least 6 characters"]
      })
    }
  }

  destroyAccount = () => {
    this.setState({
      displayLocationForm: false,
      displayPasswordForm: false
    })
    if (window.confirm('Do you really want to delete your account?')) {
      const path = '/api/v1/auth'
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.delete(path, { headers: headers })
        .then(() => {
          window.localStorage.clear()
          window.alert('Your account was succesfully deleted!')
          window.location.replace('/')
        })
        .catch(() => {
          window.alert('There was a problem deleting your account! Please login and try again.')
          window.localStorage.clear()
          window.location.replace('/login')
        })
    }
  }


  render() {
    let errorDisplay

    let locationForm
    let locationSubmitButton

    let passwordForm
    let passwordSubmitButton

    let hostProfile
    let hostProfileForm

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>Update action could not be completed because of following error(s):</Message.Header>
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
        <Button id="location-submit-button" loading>Change</Button>
      )
    } else {
      locationSubmitButton = (
        <Button id="location-submit-button" onClick={this.updateLocation}>Change</Button>
      )
    }

    if (this.state.loading) {
      passwordSubmitButton = (
        <Button id="password-submit-button" loading>Change</Button>
      )
    } else {
      passwordSubmitButton = (
        <Button id="password-submit-button" onClick={this.updatePassword}>Change</Button>
      )
    }

    if (this.state.displayLocationForm) {
      locationForm = (
        <>
          {errorDisplay}
          <Form>
            <Dropdown
              clearable
              search
              selection
              placeholder="Select new location"
              options={LOCATION_OPTIONS}
              id='location'
              style={{ 'margin-bottom': '1rem', 'width': '100%' }}
              onChange={this.handleLocationChange}
              onKeyPress={this.listenEnterKeyLocation}
            />

            <Form.Input
              required
              id='password'
              value={this.state.password}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='Your password'
              onKeyPress={this.listenEnterKeyLocation}
            />
          </Form>

          <div className='button-wrapper'>
            <div >
              <Button secondary className="cancel-button" onClick={this.locationFormHandler.bind(this)}>Cancel</Button>
            </div>
            <div>
              {locationSubmitButton}
            </div>
          </div>
        </>
      )
    }

    if (this.state.displayPasswordForm) {
      passwordForm = (
        <>
          {errorDisplay}
          <Form>
            <Form.Input
              required
              id='current_password'
              value={this.state.current_password}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='Current password'
              onKeyPress={this.listenEnterKeyPassword}
            />
            <Form.Input
              required
              id='new_password'
              value={this.state.new_password}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='New password'
              onKeyPress={this.listenEnterKeyPassword}
            />
            <Form.Input
              required
              id='new_password_confirmation'
              value={this.state.new_password_confirmation}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='New password again'
              onKeyPress={this.listenEnterKeyPassword}
            />
          </Form>

          <p className='small-centered-paragraph'>
            Upon successful password change you will be redirected back to login.
          </p>

          <div className='button-wrapper'>
            <div >
              <Button secondary className="cancel-button" onClick={this.passwordFormHandler.bind(this)}>Cancel</Button>
            </div>
            <div>
              {passwordSubmitButton}
            </div>
          </div>
        </>
      )
    }

    if(this.state.host_profile_form === true ) {
      hostProfileForm = (
        <HostProfileForm />
      )
    } else {
      hostProfileForm = (
        <>
          <p className='small-centered-paragraph'>You are not registered as a cat host and do not appear in the search. If you would like to host cats, please create a host profile.</p>
          <Button className='create-host-profile-button' onClick={this.hostProfileFormHandler.bind(this)} >Create host profile</Button>
        </>
      )
    }

    if(this.state.host_profile.length === 1) {
      hostProfile = (
        'yay, you have a host profile'
      )
    } else {
      hostProfile = (
        hostProfileForm
      )  
    }
    

    return (
      <div className='content-wrapper'>
        <Segment className='whitebox'>
          <Header as='h1'>
            Hi, {this.props.username}!
          </Header>
          <p style={{ 'textAlign': 'center' }}>
            This is your profile. Here you can update your location, picture and password.
          </p>

          <div style={{ 'width': '100%', 'margin': 'auto' }}>
            <p>
              <svg fill='grey' height='1rem' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.6 13.47A4.99 4.99 0 0 1 5 10a5 5 0 0 1 8-4V5h2v6.5a1.5 1.5 0 0 0 3 0V10a8 8 0 1 0-4.42 7.16l.9 1.79A10 10 0 1 1 20 10h-.18.17v1.5a3.5 3.5 0 0 1-6.4 1.97zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /></svg>
              &nbsp;{this.props.email}
            </p>

            <div className='flexbox-row'>
              <p id='user-location' className='top-bottom-margin-auto'>
                <svg fill='grey' height='1rem' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>
                &nbsp;{this.state.location}&nbsp;
              </p>

              <Header id='change-location-link' onClick={this.locationFormHandler.bind(this)} className='fake-link-underlined top-bottom-margin-auto'>
                Change
              </Header>
            </div>

            <div>
              {locationForm}
            </div>

            <div className='flexbox-row'>
              <p className='top-bottom-margin-auto'>
                <svg fill='grey' height='1rem' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" /></svg>
                &nbsp;******&nbsp;
              </p>

              <Header id='change-password-link' onClick={this.passwordFormHandler.bind(this)} className='fake-link-underlined top-bottom-margin-auto' >
                Change
              </Header>
            </div>

            <div>
              {passwordForm}
            </div>

          </div>

          <Header id='delete-account-link' onClick={this.destroyAccount} className='fake-link-underlined' >
            Delete your account
          </Header>

          {hostProfile}

        </Segment>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  location: state.reduxTokenAuth.currentUser.attributes.location,
  email: state.reduxTokenAuth.currentUser.attributes.uid,
  id: state.reduxTokenAuth.currentUser.attributes.id
})

export default connect(mapStateToProps)(UserPage)
