import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import MessageBubble from '../ReusableComponents/MessageBubble'
import { Image, Input, Icon, Message, Header, Container, Divider } from 'semantic-ui-react'
import Cable from 'actioncable'

class Conversation extends Component {

  state = {
    newMessage: '',
    chatLogs: [],
    messagesHistory: [],
    errorDisplay: false,
    errors: '',
    scrollYPosition: 0
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
        this.setState({ messagesHistory: sortedResponse })
        this.bottom.scrollIntoView({ behavior: 'smooth' })
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
    if (this.state.newMessage.length < 1 || this.state.newMessage.length > 1000) {
      this.handleError(['The message cannot be empty or exceed 1000 characters!'])
    } else {
      this.chats.create(this.state.newMessage, this.props.location.state.id, this.props.id)
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
      create: function (msg, conv_id, user_id) {
        this.perform('send_message', {
          body: msg,
          user_id: user_id,
          conversation_id: conv_id
        })
      }
    })
  }

  componentWillMount() { this.createSocket() }

  render() {
    let messagesHistory, errorDisplay, messageLength, boxShadow, currentLogs

    boxShadow = this.state.scrollYPosition > 0 ? '0 0 20px -5px rgba(0,0,0,.2)' : 'none'

    messageLength = 1000 - this.state.newMessage.length

    if (this.state.errorDisplay) {
      errorDisplay = (
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
      )
    }

    if (this.state.messagesHistory.length < 1 && this.state.chatLogs.length < 1) {
      messagesHistory = (
        <p style={{ 'textAlign': 'center', 'fontStyle': 'italic' }}>
          You don't have any messages in this conversation (yet).
        </p>
      )
    } else if (this.state.messagesHistory.length > 0) {
      messagesHistory = (
        this.state.messagesHistory.map(message => {
          return MessageBubble(this.props.username, this.props.avatar, this.props.location.state.user.avatar, message)
        })
      )
    }

    if (this.state.chatLogs.length > 0) {
      currentLogs = (
        this.state.chatLogs.map(message => {
          return MessageBubble(this.props.username, this.props.avatar, this.props.location.state.user.avatar, message)
        })
      )
    }

    return (
      <>
        <div style={{ 'margin': '0 auto', 'padding': '5vw 1.5rem 1rem', 'background': 'white', 'position': 'fixed', 'top': '10vh', 'overflow': 'hidden', 'width': '100%', 'zIndex': '100', 'boxShadow': boxShadow }}>
          <div className='max-width-wrapper' style={{ 'display': 'flex', 'alignItems': 'center' }}>
            <Icon name='arrow left' size='large' style={{ 'color': '#c90c61', 'cursor': 'pointer' }} onClick={() => { this.props.history.push('/messenger') }} />
            <div style={{ 'display': 'inline', 'margin': 'auto', 'cursor': 'pointer' }}>
              <Header as='h2' onClick={() => {
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
              }
              }>
                <Image src={this.props.location.state.user.avatar === null ? `https://ui-avatars.com/api/?name=${this.props.location.state.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : this.props.location.state.user.avatar} size='mini' style={{ 'borderRadius': '50%', 'height': '2rem', 'width': '2rem', 'marginTop': '0' }} />
                {this.props.location.state.user.nickname}
              </Header>
            </div>
            <Icon name='trash alternate outline' size='large' style={{ 'color': '#c90c61' }} />
          </div>
        </div>
        <Container className='messenger-wrapper' style={{ 'marginBottom': '100px' }}>
          <Divider />
          <div className='single-conversation-wrapper'>
            {messagesHistory}
            {currentLogs}
            {errorDisplay}
            <div ref={(el) => { this.bottom = el }}></div>
          </div>
        </Container>
        <div style={{ 'minHeight': '80px', 'width': '100%', 'position': 'fixed', 'bottom': '0', 'overflow': 'hidden', 'background': 'white', 'zIndex': '100', 'boxShadow': '0 0 20px -5px rgba(0,0,0,.2)' }}>
          <div className='single-conversation-wrapper' >
            <div style={{ 'display': 'inline-flex', 'width': '100%' }}>
              <Icon name='photo' size='big' style={{ 'color': '#d8d8d8', 'fontSize': '2.5em', 'marginRight': '0.5rem' }} />
              <Input
                fluid
                style={{ 'marginBottom': '0', 'width': '100%' }}
                id='newMessage'
                value={this.state.newMessage}
                onChange={this.onChangeHandler}
                placeholder='Say something..'
                onKeyPress={this.listenEnterKeyMessage}
                icon={
                  <Icon
                    id='send'
                    name='arrow alternate circle up'
                    link
                    size='large'
                    onClick={(e) => this.handleSendEvent(e)}
                    style={{
                      'color': '#c90c61',
                      'marginRight': '-0.5rem',
                      'display': this.state.newMessage === '' ? 'none' : 'block'
                    }}
                  />
                }
              />
            </div>
            <p style={{ 'textAlign': 'end', 'fontSize': 'smaller', 'fontStyle': 'italic', 'display': messageLength < 100 ? 'block' : 'none' }}>
              Remaining characters: {messageLength}
            </p>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar
})

export default connect(mapStateToProps)(Conversation)
