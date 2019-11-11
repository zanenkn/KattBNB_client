import React, { Component } from 'react'
import axios from 'axios'
import ReactAvatarEditor from 'react-avatar-editor'
import Popup from 'reactjs-popup'
import { Button, Message, Image, Icon } from 'semantic-ui-react'

class AvatarUpdateForm extends Component {

  state = {
    loading: false,
    errorDisplay: false,
    errors: '',
    image: '',
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0
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
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false
          })
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

  closeModal = () => {
    this.setState({
      errorDisplay: false,
      errors: '',
      image: ''
    })
  }


  render() {
    let errorDisplay, avatarSubmitButton, avatarRotateRight, avatarRotateLeft, noAvatar

    noAvatar = `https://ui-avatars.com/api/?name=${this.props.username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`

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

    return (
      <div style={{ 'margin': 'auto', 'display': 'table', 'marginBottom': '2rem' }} >
        <Icon.Group size='big' onClick={this.props.closeAllForms}>
          <Image src={this.props.avatar === null ? noAvatar : this.props.avatar} size='small' style={{ 'borderRadius': '50%' }}></Image>
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
            onClose={this.closeModal}
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
  }
}

export default AvatarUpdateForm
