import React, { Component } from 'react'
import axios from 'axios'
import ReactAvatarEditor from 'react-avatar-editor'
import Popup from 'reactjs-popup'
import Spinner from '../ReusableComponents/Spinner'
import { Button, Message, Image, Icon } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next'

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
      window.localStorage.removeItem('access-token')
      window.localStorage.removeItem('token-type')
      window.localStorage.removeItem('client')
      window.localStorage.removeItem('uid')
      window.localStorage.removeItem('expiry')
      window.location.replace('/login')
    } else if (this.state.image === '') {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['AvatarUpdateForm:no-avatar-error']
      })
    } else if (this.state.image.type !== 'image/jpeg' && this.state.image.type !== 'image/jpg' && this.state.image.type !== 'image/png' && this.state.image.type !== 'image/gif') {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['AvatarUpdateForm:file-type-error']
      })
    }
    else {
      e.preventDefault()
      this.setState({ loading: true })
      const img = this.editor.getImageScaledToCanvas().toDataURL()
      const path = '/api/v1/auth/'
      const payload = { avatar: img }
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload, { headers: headers })
        .then(() => {
          this.setState({ errorDisplay: false })
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
    const { t } = this.props

    if (this.props.tReady) {
      let errorDisplay, avatarRotateRight, avatarRotateLeft, noAvatar

      noAvatar = `https://ui-avatars.com/api/?name=${this.props.username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`

      if (this.state.errorDisplay) {
        errorDisplay = (
          <Message negative style={{ 'width': 'inherit' }} >
            <Message.Header style={{ 'textAlign': 'center' }}>{t('reusable:errors.action-error-header')}</Message.Header>
            <ul id='message-error-list'>
              {this.state.errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )
      }

      if (this.state.loading) {
        avatarRotateRight = (
          <Icon disabled name='redo alternate' style={{ 'position': 'inherit', 'fontSize': '2em', 'marginTop': '0.1em', 'color': '#d8d8d8' }} />
        )
        avatarRotateLeft = (
          <Icon disabled name='undo alternate' style={{ 'position': 'inherit', 'fontSize': '2em', 'marginTop': '0.1em', 'color': '#d8d8d8' }} />
        )
      } else {
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
                  style={{ 'marginBottom': '1rem', 'backgroundColor': '#c90c61', 'textShadow': 'none', 'color': '#ffffff', 'cursor': 'pointer' }}
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
                  <Button id='avatar-submit-button' className='submit-button' disabled={this.state.loading} loading={this.state.loading} onClick={this.updateAvatar}>{t('reusable:cta:save')}</Button>
                </div>
              </div>
            </Popup>
          </Icon.Group>
        </div>
      )
    } else { return <Spinner /> }
  }
}

export default withTranslation('AvatarUpdateForm')(AvatarUpdateForm)
