import React, { Component } from 'react'
import HostProfileForm from '../HostProfile/HostProfileForm'
import HostProfile from '../HostProfile/HostProfile'
import { connect } from 'react-redux'
import { Header, Segment, Button, Divider } from 'semantic-ui-react'
import axios from 'axios'
import LocationUpdateForm from './LocationUpdateForm'
import PasswordUpdateForm from './PasswordUpdateForm'
import AvatarUpdateForm from './AvatarUpdateForm'

class UserPage extends Component {

  hostProfileElement = React.createRef()

  state = {
    displayLocationForm: false,
    displayPasswordForm: false,
    hostProfile: '',
    hostProfileForm: false,
    description: '',
    fullAddress: '',
    rate: '',
    maxCats: '',
    supplement: '',
    availability: [],
    selectedDays: []
  }

  async componentDidMount() {
    await axios.get(`/api/v1/host_profiles?user_id=${this.props.id}`).then(response => {
      this.setState({ hostProfile: response.data })
    })
    if (this.state.hostProfile.length === 1) {
      const path = `/api/v1/host_profiles/${this.state.hostProfile[0].id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.get(path, { headers: headers })
        .then(response => {
          this.setState({
            description: response.data.description,
            fullAddress: response.data.full_address,
            rate: response.data.price_per_day_1_cat,
            maxCats: response.data.max_cats_accepted,
            supplement: response.data.supplement_price_per_cat_per_day,
            availability: response.data.availability,
            selectedDays: response.data.availability.map(function (date) {
              return new Date(date)
            })
          })
        })
    }
  }

  avatarFormHandler = () => {
    this.setState({
      displayLocationForm: false,
      displayPasswordForm: false,
      hostProfileForm: false
    })
    if (this.state.hostProfile.length === 1) {
      this.hostProfileElement.current.closeAllForms()
    }
  }

  locationFormHandler = () => {
    this.setState({
      displayLocationForm: !this.state.displayLocationForm,
      displayPasswordForm: false,
      hostProfileForm: false
    })
    if (this.state.hostProfile.length === 1) {
      this.hostProfileElement.current.closeAllForms()
    }
  }

  passwordFormHandler = () => {
    this.setState({
      displayPasswordForm: !this.state.displayPasswordForm,
      displayLocationForm: false,
      hostProfileForm: false
    })
    if (this.state.hostProfile.length === 1) {
      this.hostProfileElement.current.closeAllForms()
    }
  }

  hostProfileFormHandler = () => {
    this.setState({
      hostProfileForm: !this.state.hostProfileForm,
      displayLocationForm: false,
      displayPasswordForm: false
    })
  }

  closeLocationAndPasswordForms = () => {
    this.setState({
      displayLocationForm: false,
      displayPasswordForm: false
    })
  }

  destroyAccount = () => {
    this.setState({
      displayLocationForm: false,
      displayPasswordForm: false,
      hostProfileForm: false
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
    let locationForm, passwordForm, hostProfile, hostProfileForm

    if (this.state.displayLocationForm) {
      locationForm = (
        <LocationUpdateForm
          location={this.props.location}
          fullAddress={this.state.fullAddress}
          closeLocationAndPasswordForms={this.closeLocationAndPasswordForms.bind(this)}
        />
      )
    }

    if (this.state.displayPasswordForm) {
      passwordForm = (
        <PasswordUpdateForm
          closeLocationAndPasswordForms={this.closeLocationAndPasswordForms.bind(this)}
        />
      )
    }

    if (this.state.hostProfileForm === true) {
      hostProfileForm = (
        <HostProfileForm
          user_id={this.props.id}
          closeForm={this.hostProfileFormHandler.bind(this)}
          location={this.props.location} />
      )
    } else {
      hostProfileForm = (
        <div style={{ 'maxWidth': '300px', 'margin': 'auto' }}>
          <p className='small-centered-paragraph'>You are not registered as a cat host and do not appear in the search. If you would like to host cats, please create a host profile.</p>
          <Button id='create-host-profile-button' onClick={this.hostProfileFormHandler.bind(this)} >Create host profile</Button>
        </div>
      )
    }

    if (this.state.hostProfile.length === 1) {
      hostProfile = (
        <HostProfile
          id={this.state.hostProfile[0].id}
          description={this.state.description}
          fullAddress={this.state.fullAddress}
          rate={this.state.rate}
          maxCats={this.state.maxCats}
          supplement={this.state.supplement}
          availability={this.state.availability}
          selectedDays={this.state.selectedDays}
          location={this.props.location}
          closeLocPasForms={this.closeLocationAndPasswordForms.bind(this)}
          ref={this.hostProfileElement} />
      )
    } else {
      hostProfile = (
        hostProfileForm
      )
    }

    return (
      <div className='content-wrapper'>
        <Segment className='whitebox'>
          <Header as='h2'>
            Hi, {this.props.username}!
          </Header>
          <p style={{ 'textAlign': 'center' }}>
            This is your <strong> basic </strong> profile. Here you can update your avatar, location, and password.
          </p>
          <AvatarUpdateForm
            avatar={this.props.avatar}
            username={this.props.username}
            closeAllForms={this.avatarFormHandler.bind(this)}
          />
          <div style={{ 'margin': 'auto', 'display': 'table' }}>
            <p>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M13.6 13.47A4.99 4.99 0 0 1 5 10a5 5 0 0 1 8-4V5h2v6.5a1.5 1.5 0 0 0 3 0V10a8 8 0 1 0-4.42 7.16l.9 1.79A10 10 0 1 1 20 10h-.18.17v1.5a3.5 3.5 0 0 1-6.4 1.97zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' /></svg>
              &nbsp;{this.props.email}
            </p>
            <p id='user-location'>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
              &nbsp;{this.props.location}&ensp;
              <Header as='strong' id='change-location-link' onClick={this.locationFormHandler} className='fake-link-underlined'>
                Change
              </Header>
            </p>
            {locationForm}
            <p>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z' /></svg>
              &nbsp;******&ensp;
              <Header as='strong' id='change-password-link' onClick={this.passwordFormHandler} className='fake-link-underlined'>
                Change
              </Header>
            </p>
            {passwordForm}
          </div>
        </Segment>
        <Divider hidden />
        {hostProfile}
        <Divider hidden />
        <Header id='delete-account-link' onClick={this.destroyAccount} className='fake-link-underlined' style={{ 'color': 'silver', 'marginBottom': '1rem' }} >
          Delete your account
        </Header>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  location: state.reduxTokenAuth.currentUser.attributes.location,
  email: state.reduxTokenAuth.currentUser.attributes.uid,
  id: state.reduxTokenAuth.currentUser.attributes.id,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar
})

export default connect(mapStateToProps)(UserPage)
