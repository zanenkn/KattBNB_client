import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Spinner from '../ReusableComponents/Spinner'
import MessageBubble from '../ReusableComponents/MessageBubble'
import { Icon, Message, Header, Container, Divider, Image } from 'semantic-ui-react'
import Cable from 'actioncable'
import TextareaAutosize from 'react-textarea-autosize'
import Popup from 'reactjs-popup'
import ImageUploadPopup from './ImageUploadPopup'
import imagenation from 'imagenation'

class Conversation extends Component {

  state = {
    newMessage: '',
    chatLogs: [],
    messagesHistory: [],
    errorDisplay: false,
    errors: '',
    scrollYPosition: 0,
    loading: true,
    footerHeight: '32px',
    imageUploadPopupOpen: false,
    imageUploadButton: true,
    uploadedImage: '',
    loadingUploadButton: false
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    const path = `/api/v1/conversations/${this.props.location.state.id}`
    axios.get(path, { headers: headers })
      .then(response => {
        const sortedResponse = response.data.message.sort(function (a, b) {
          let dateA = new Date(a.created_at), dateB = new Date(b.created_at)
          return dateA - dateB
        })
        this.setState({
          messagesHistory: sortedResponse,
          loading: false
        })
        this.bottom.scrollIntoView({ behavior: 'smooth' })
      })
  }

  scrollDown = () => {
    this.bottom.scrollIntoView({ behavior: 'smooth' })
    this.setState({
      imageUploadPopupOpen: false,
      loadingUploadButton: false
    })
  }

  componentWillUnmount() { window.removeEventListener('scroll', this.handleScroll) }

  handleScroll = () => {
    this.setState({ scrollYPosition: window.scrollY })
  }

  listenEnterKeyMessage = (event) => {
    if (event.key === 'Enter') {
      this.handleSendEvent(event)
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      errorDisplay: false,
      errors: ''
    })
  }

  async handleError(errors) {
    await this.setState({
      errors: errors,
      errorDisplay: true
    })
    this.bottom.scrollIntoView({ behavior: 'smooth' })
  }

  handleSendEvent(event) {
    event.preventDefault()
    if (this.state.uploadedImage !== '') {
      this.chats.create(this.state.newMessage, this.state.uploadedImage, this.props.location.state.id, this.props.id)
      this.setState({
        newMessage: '',
        loadingUploadButton: true
      })
    }
    else if (this.state.newMessage.length < 1 || this.state.newMessage.length > 1000) {
      this.handleError(['The message cannot be empty or exceed 1000 characters!'])
    } else {
      this.chats.create(this.state.newMessage, this.state.uploadedImage, this.props.location.state.id, this.props.id)
      this.setState({ newMessage: '' })
    }
  }

  createSocket() {
    let uid = window.localStorage.getItem('uid')
    let client = window.localStorage.getItem('client')
    let token = window.localStorage.getItem('access-token')
    let path = (process.env.NODE_ENV === 'development' ? 'ws://localhost:3007' : process.env.REACT_APP_API_ENDPOINT)
    let cable = Cable.createConsumer(`${path}/api/v1/cable/conversation/${this.props.location.state.id}?token=${token}&uid=${uid}&client=${client}`)
    this.chats = cable.subscriptions.create({
      channel: 'ConversationsChannel',
      conversations_id: this.props.location.state.id
    }, {
      connected: () => { },
      received: (data) => {
        let chatLogs = this.state.chatLogs
        chatLogs.push(data.message)
        this.setState({ chatLogs: chatLogs })
        this.bottom.scrollIntoView({ behavior: 'smooth' })
      },
      create: function (msg, img, conv_id, user_id) {
        this.perform('send_message', {
          body: msg,
          image: img,
          user_id: user_id,
          conversation_id: conv_id
        })
      }
    })
  }

  clearImage = () => {
    this.setState({
      imageUploadButton: true,
      uploadedImage: ''
    })
  }

  deleteConversation = () => {
    this.setState({ loading: true })
    if (window.confirm('Do you really want to delete this conversation?')) {
      const path = `/api/v1/conversations/${this.props.location.state.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = {
        hidden: this.props.id
      }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          window.location.replace('/messenger')
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.error
          })
        })
    } else {
      this.setState({ loading: false })
    }
  }

  onImageDropHandler = async (pictureFiles) => {
    if (pictureFiles.length > 0) {
      this.setState({
        imageUploadButton: false,
        uploadedImage: [await imagenation(pictureFiles[0], 750)]
      })
    } else { this.clearImage() }
  }

  componentWillMount() { this.createSocket() }

  render() {
    let boxShadow = this.state.scrollYPosition > 0 ? '0 0 20px -5px rgba(0,0,0,.2)' : 'none'
    let messageLength = 1000 - this.state.newMessage.length

    if (this.state.loading) {
      return <Spinner />
    } else {
      return (
        <>
          <Popup
            modal
            open={this.state.imageUploadPopupOpen}
            closeOnDocumentClick={!this.state.loadingUploadButton}
            onClose={() => { this.setState({ imageUploadPopupOpen: false, uploadedImage: '', imageUploadButton: true }) }}
            position='top center'
          >
            <div>
              <ImageUploadPopup
                onImageDropHandler={this.onImageDropHandler.bind(this)}
                imageUploadButton={this.state.imageUploadButton}
                handleSendEvent={this.handleSendEvent.bind(this)}
                uploadedImage={this.state.uploadedImage}
                loadingUploadButton={this.state.loadingUploadButton}
                clearImage={this.clearImage}
              />
            </div>
          </Popup>
          <div style={{ 'margin': '0 auto', 'padding': '5vw 1.5rem 1rem', 'background': 'white', 'position': 'fixed', 'top': '10vh', 'overflow': 'hidden', 'width': '100%', 'zIndex': '100', 'boxShadow': boxShadow }}>
            <div className='max-width-wrapper' style={{ 'display': 'flex', 'alignItems': 'center' }}>
              <Icon name='arrow left' size='large' style={{ 'color': '#c90c61', 'cursor': 'pointer' }} onClick={() => { this.props.history.push('/messenger') }} />
              <div
                style={{ 'display': 'flex', 'margin': 'auto', 'cursor': this.props.location.state.user.id !== null && 'pointer' }}
                onClick={() => {
                  this.props.location.state.user.id !== null &&
                    this.props.history.push({
                      pathname: '/host-profile',
                      state: {
                        userId: this.props.location.state.user.id,
                        avatar: this.props.location.state.user.avatar,
                        nickname: this.props.location.state.user.nickname,
                        location: this.props.location.state.user.location,
                        errors: '',
                        noMessage: true
                      }
                    })
                }}
              >
                <Image
                  src={this.props.location.state.user.avatar === null ?
                    `https://ui-avatars.com/api/?name=${this.props.location.state.user.nickname === 'Deleted user' ? '[x]' : this.props.location.state.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
                    : this.props.location.state.user.avatar}

                  size='mini' style={{ 'borderRadius': '50%', 'height': '2rem', 'width': '2rem', 'marginTop': '0', 'marginRight': '1rem' }} />

                <Header as='h2' style={{ 'marginTop': '0' }}>
                  {this.props.location.state.user.nickname}
                </Header>
              </div>
              <Icon id='delete-conversation' name='trash alternate outline' size='large' style={{ 'color': '#c90c61', 'cursor': 'pointer' }} onClick={this.deleteConversation} />
            </div>
          </div>
          <Container className='messenger-wrapper' style={{ 'marginBottom': `${70 + parseInt(this.state.footerHeight)}px` }}>
            <Divider />
            <div className='single-conversation-wrapper'>
              {this.state.messagesHistory.length < 1 && this.state.chatLogs.length < 1 &&
                <p style={{ 'textAlign': 'center', 'fontStyle': 'italic' }}>
                  You don't have any messages in this conversation (yet).
                </p>
              }
              {this.state.messagesHistory.length > 0 &&
                this.state.messagesHistory.map(message => {
                  return (
                    <div key={message.id} >
                      <MessageBubble
                        currentUsername={this.props.username}
                        currentAvatar={this.props.avatar}
                        otherAvatar={this.props.location.state.user.avatar}
                        message={message}
                        scrollDown={this.scrollDown.bind(this)}
                      />
                    </div>
                  )
                })
              }
              {this.state.chatLogs.length > 0 &&
                this.state.chatLogs.map(message => {
                  return (
                    <div key={message.id} >
                      <MessageBubble
                        currentUsername={this.props.username}
                        currentAvatar={this.props.avatar}
                        otherAvatar={this.props.location.state.user.avatar}
                        message={message}
                        scrollDown={this.scrollDown.bind(this)}
                      />
                    </div>
                  )
                })
              }
              {this.state.errorDisplay &&
                <Message negative style={{ 'width': 'inherit' }} >
                  <Message.Header style={{ 'textAlign': 'center' }} >
                    Could not send the message because of following error(s):
                  </Message.Header>
                  <ul id='message-error-list'>
                    {this.state.errors.map(error => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </Message>
              }
              <div ref={(el) => { this.bottom = el }}></div>
            </div>
          </Container>
          <div style={{ 'minHeight': '80px', 'width': '100%', 'position': 'fixed', 'bottom': '0', 'background': 'white', 'zIndex': '100', 'boxShadow': '0 0 20px -5px rgba(0,0,0,.2)' }}>
            <div className='single-conversation-wrapper' >
              <div style={{ 'display': 'inline-flex', 'width': '100%', 'paddingTop': '0.2rem' }}>
                <Icon id='upload-image' name='photo' size='big' style={{ 'display': (this.props.location.state.user.id === null || this.state.newMessage.length > 0) && 'none', 'cursor': 'pointer', 'color': '#d8d8d8', 'fontSize': '2.5em', 'marginRight': '0.5rem', 'alignSelf': 'flex-end' }} onClick={() => { this.setState({ imageUploadPopupOpen: true }) }} />
                <div style={{ 'width': '100%', 'alignSelf': 'flex-end', 'minHeight': '2.5em', 'position': 'relative', 'bottom': '0px', 'display': 'flex', 'flexDirection': 'column-reverse', 'height': this.state.footerHeight }}>
                  <TextareaAutosize
                    minRows={1}
                    maxRows={6}
                    className='expanding-textarea disable-scrollbars'
                    placeholder='Say something..'
                    id='newMessage'
                    value={this.state.newMessage}
                    onChange={this.onChangeHandler}
                    onKeyPress={this.listenEnterKeyMessage}
                    onHeightChange={(height) => this.setState({ footerHeight: `${height}px` })}
                    disabled={this.props.location.state.user.id === null && true}
                    style={{ 'paddingRight': '40px' }}
                  />
                  <div style={{
                    'display': this.state.newMessage === '' ? 'none' : 'block',
                    'zIndex': '4000',
                    'alignSelf': 'flex-end',
                    'marginBottom': '0.6rem',
                    'marginRight': '0.5rem',
                    'background': 'white',
                    'paddingLeft': '0.5rem',
                    'paddingTop': '0.4rem'
                  }}>
                    <Icon
                      id='send'
                      name='arrow alternate circle up'
                      link
                      size='large'
                      onClick={(e) => this.handleSendEvent(e)}
                      style={{ 'color': '#c90c61' }}
                    />
                  </div>
                </div>
              </div>
              <p style={{ 'textAlign': 'end', 'fontSize': 'smaller', 'fontStyle': 'italic', 'visibility': messageLength < 100 ? 'visible' : 'hidden', 'marginBottom': '0.5rem' }}>
                Remaining characters: {messageLength}
              </p>
            </div>
          </div>
        </>
      )
    }
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar
})

export default connect(mapStateToProps)(Conversation)
