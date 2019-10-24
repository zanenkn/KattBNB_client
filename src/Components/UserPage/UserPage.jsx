import React, { Component } from 'react'
import HostProfileForm from '../HostProfile/HostProfileForm'
import HostProfile from '../HostProfile/HostProfile'
import { connect } from 'react-redux'
import { Header, Segment, Form, Button, Message, Divider, Image, Icon } from 'semantic-ui-react'
import axios from 'axios'
import ReactAvatarEditor from 'react-avatar-editor'
import Popup from 'reactjs-popup'
import LocationUpdateForm from './LocationUpdateForm'

class UserPage extends Component {

  hostProfileElement = React.createRef()

  state = {
    displayLocationForm: false,
    displayPasswordForm: false,
    avatar: this.props.avatar,
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
    loading: false,
    errorDisplay: false,
    errors: '',
    hostProfile: '',
    hostProfileForm: false,
    image: '',
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0
  }

  async componentDidMount() {
    await axios.get(`/api/v1/host_profiles?user_id=${this.props.id}`).then(response => {
      this.setState({ hostProfile: response.data })
    })
    if (this.state.hostProfile.length === 1) {
      this.setState({
        location: this.state.hostProfile[0]['user']['location'],
        newLocation: this.state.hostProfile[0]['user']['location']
      })
    }
  }

  listenEnterKeyPassword = (event) => {
    if (event.key === 'Enter') {
      this.updatePassword(event)
    }
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  avatarFormHandler = () => {
    this.setState({
      displayLocationForm: false,
      displayPasswordForm: false,
      hostProfileForm: false,
      errorDisplay: false,
      errors: '',
      image: '',
      position: { x: 0.5, y: 0.5 },
      rotate: 0,
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    })
    if (this.state.hostProfile.length === 1) {
      this.hostProfileElement.current.closeAllForms()
    }
  }

  locationFormHandler = () => {
    this.setState({
      displayLocationForm: !this.state.displayLocationForm,
      displayPasswordForm: false,
      hostProfileForm: false,
      errorDisplay: false,
      errors: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    })
    if (this.state.hostProfile.length === 1) {
      this.hostProfileElement.current.closeAllForms()
    }
  }

  passwordFormHandler = () => {
    this.setState({
      displayPasswordForm: !this.state.displayPasswordForm,
      displayLocationForm: false,
      hostProfileForm: false,
      errorDisplay: false,
      errors: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    })
    if (this.state.hostProfile.length === 1) {
      this.hostProfileElement.current.closeAllForms()
    }
  }

  hostProfileFormHandler = () => {
    this.setState({
      hostProfileForm: !this.state.hostProfileForm,
      displayLocationForm: false,
      displayPasswordForm: false,
      errorDisplay: false,
      errors: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    })
  }

  closeLocationAndPasswordForms = () => {
    this.setState({
      displayLocationForm: false,
      displayPasswordForm: false,
      errorDisplay: false,
      errors: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    })
  }

  setEditorRef = editor => {
    if (editor) this.editor = editor
  }

  handleNewImage = e => {
    this.setState({
      image: e.target.files[0],
      position: { x: 0.5, y: 0.5 },
      errorDisplay: false,
      errors: []
    })
  }

  rotateLeft = e => {
    e.preventDefault()
    this.setState({ rotate: this.state.rotate - 90 })
  }

  rotateRight = e => {
    e.preventDefault()
    this.setState({ rotate: this.state.rotate + 90 })
  }

  handleXPosition = e => {
    const x = parseFloat(e.target.value)
    this.setState({ position: { ...this.state.position, x } })
  }

  handleYPosition = e => {
    const y = parseFloat(e.target.value)
    this.setState({ position: { ...this.state.position, y } })
  }

  handlePositionChange = position => {
    this.setState({ position })
  }

  updateAvatar = (e) => {
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else if (this.state.image === '') {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['You have selected no avatar!']
      })
    } else if (this.state.image.type !== 'image/jpeg' && this.state.image.type !== 'image/jpg' && this.state.image.type !== 'image/png' && this.state.image.type !== 'image/gif') {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['Please select a JPG, JPEG, PNG or GIF image file!']
      })
    }
    else {
      e.preventDefault()
      this.setState({ loading: true })
      const img = this.editor.getImageScaledToCanvas().toDataURL()
      const path = '/api/v1/auth/'
      const payload = {
        avatar: img,
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload)
        .then(response => {
          this.setState({
            avatar: response.data.data.avatar,
            loading: false,
            errorDisplay: false
          })
          window.location.reload(true)
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

  

  updatePassword = (e) => {
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.clear()
      window.location.replace('/login')
    } else if (this.state.newPassword === this.state.newPasswordConfirmation && this.state.newPassword.length >= 6) {
      this.setState({ loading: true })
      e.preventDefault()
      const path = '/api/v1/auth/password'
      const payload = {
        current_password: this.state.currentPassword,
        password: this.state.newPassword,
        password_confirmation: this.state.newPasswordConfirmation,
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload)
        .then(() => {
          this.setState({
            displayPasswordForm: false,
            errorDisplay: false
          })
          window.location.replace('/login')
          window.localStorage.clear()
          window.alert('Your password was successfully changed!')
        })
        .catch(error => {
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
    let errorDisplay, locationForm, passwordForm, passwordSubmitButton, hostProfile, hostProfileForm, avatar, avatarSubmitButton, avatarRotateRight, avatarRotateLeft, noAvatar

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
      passwordSubmitButton = (
        <Button id='password-submit-button' className='submit-button' loading>Change</Button>
      )
      avatarSubmitButton = (
        <Button id='avatar-submit-button' className='submit-button' loading>Save</Button>
      )
      avatarRotateRight = (
        <Icon disabled name='redo alternate' style={{ 'position': 'inherit', 'fontSize': '2em', 'marginTop': '0.1em', 'color': '#d8d8d8' }} />
      )
      avatarRotateLeft = (
        <Icon disabled name='undo alternate' style={{ 'position': 'inherit', 'fontSize': '2em', 'marginTop': '0.1em', 'color': '#d8d8d8' }} />
      )
    } else {
      passwordSubmitButton = (
        <Button id='password-submit-button' className='submit-button' onClick={this.updatePassword}>Change</Button>
      )
      avatarSubmitButton = (
        <Button id='avatar-submit-button' className='submit-button' onClick={this.updateAvatar}>Save</Button>
      )
      if (this.state.image === '') {
        avatarRotateRight = (
          <Icon disabled name='redo alternate' style={{ 'position': 'inherit', 'fontSize': '2em', 'marginTop': '0.1em', 'color': '#d8d8d8' }} />
        )
        avatarRotateLeft = (
          <Icon disabled name='undo alternate' style={{ 'position': 'inherit', 'fontSize': '2em', 'marginTop': '0.1em', 'color': '#d8d8d8' }} />
        )
      } else {
        avatarRotateRight = (
          <Icon name='redo alternate' style={{ 'position': 'inherit', 'fontSize': '2em', 'marginTop': '0.1em', 'color': '#d8d8d8' }} onClick={this.rotateRight} />
        )
        avatarRotateLeft = (
          <Icon name='undo alternate' style={{ 'position': 'inherit', 'fontSize': '2em', 'marginTop': '0.1em', 'color': '#d8d8d8' }} onClick={this.rotateLeft} />
        )
      }
    }

    noAvatar = `https://ui-avatars.com/api/?name=${this.props.username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
    avatar = (
      <div style={{ 'margin': 'auto', 'display': 'table', 'marginBottom': '2rem' }} >
        <Icon.Group size='big' onClick={this.avatarFormHandler}>
          <Image src={this.state.avatar === null ? noAvatar : this.state.avatar} size='small' style={{ 'borderRadius': '50%' }}></Image>
          <Popup
            modal
            className='avatar-popup'
            trigger={
              <Icon
                id='add-avatar'
                corner='bottom right'
                name='pencil alternate'
                circular
                style={{ 'marginBottom': '1rem', 'backgroundColor': '#c90c61', 'textShadow': 'none', 'color': '#ffffff' }}
              />
            }
            position='top center'
            closeOnDocumentClick={true}
          >
            <div style={{ 'marginBottom': '1rem' }}>
              <div>
                <ReactAvatarEditor
                  ref={this.setEditorRef}
                  width={258}
                  height={258}
                  position={this.state.position}
                  onPositionChange={this.handlePositionChange}
                  rotate={parseFloat(this.state.rotate)}
                  borderRadius={129}
                  image={this.state.image}
                  className='editor-canvas'
                />
              </div>
              <div className='button-wrapper' style={{ 'marginBottom': '1rem' }}>
                <div>
                  <label for='files'>
                    <Icon.Group>
                      <Icon name='photo' size='big' style={{ 'color': '#d8d8d8', 'fontSize': '2.5em' }} />
                      <Icon
                        corner='bottom right'
                        name='add'
                        style={{ 'textShadow': 'none', 'color': '#c90c61' }}
                      />
                    </Icon.Group>
                  </label>
                  <input id='files' style={{ 'display': 'none' }} onChange={this.handleNewImage} type='file' />
                </div>
                <div>
                  {avatarRotateLeft}
                </div>
                <div>
                  {avatarRotateRight}
                </div>
              </div>
              {errorDisplay}
              <div className='button-wrapper'>
                {avatarSubmitButton}
              </div>
            </div>
          </Popup>
        </Icon.Group>
      </div>
    )

    if (this.state.displayLocationForm) {
      locationForm = (
        <LocationUpdateForm />
      )
    }

    if (this.state.displayPasswordForm) {
      passwordForm = (
        <>
          <Divider />
          <Form style={{ 'maxWidth': '194px' }}>
            <Form.Input
              required
              id='currentPassword'
              value={this.state.currentPassword}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='Current password'
              onKeyPress={this.listenEnterKeyPassword}
            />
            <Form.Input
              required
              id='newPassword'
              value={this.state.newPassword}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='New password'
              onKeyPress={this.listenEnterKeyPassword}
            />
            <Form.Input
              required
              id='newPasswordConfirmation'
              value={this.state.newPasswordConfirmation}
              type='password'
              onChange={this.onChangeHandler}
              placeholder='New password again'
              onKeyPress={this.listenEnterKeyPassword}
            />
            <p className='small-centered-paragraph' style={{ 'marginBottom': '0' }}>
              Upon successful password change you will be redirected back to login.
            </p>
            {errorDisplay}
          </Form>
          <div className='button-wrapper'>
            <Button secondary className='cancel-button' onClick={this.passwordFormHandler}>Close</Button>
            {passwordSubmitButton}
          </div>
          <Divider style={{ 'marginBottom': '2rem' }} />
        </>
      )
    }

    if (this.state.hostProfileForm === true) {
      hostProfileForm = (
        <HostProfileForm
          user_id={this.props.id}
          closeForm={this.hostProfileFormHandler.bind(this)}
          location={this.state.location} />
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
          location={this.state.location}
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
          {avatar}
          <div style={{ 'margin': 'auto', 'display': 'table' }}>
            <p>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M13.6 13.47A4.99 4.99 0 0 1 5 10a5 5 0 0 1 8-4V5h2v6.5a1.5 1.5 0 0 0 3 0V10a8 8 0 1 0-4.42 7.16l.9 1.79A10 10 0 1 1 20 10h-.18.17v1.5a3.5 3.5 0 0 1-6.4 1.97zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' /></svg>
              &nbsp;{this.props.email}
            </p>
            <p id='user-location'>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
              &nbsp;{this.state.location}&ensp;
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
