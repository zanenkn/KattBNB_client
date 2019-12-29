import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment'
import timeFormat from '../../Modules/dateFormatting'
import { Image, Input, Icon, Message, Header, Container, Divider } from 'semantic-ui-react'

class Conversation extends Component {
  state = {
    messages: '',
    newMessage: '',
    loading: false,
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
        this.setState({ messages: sortedResponse })
        this.bottom.scrollIntoView({ behavior: 'smooth' })
      })
  }

  componentWillUnmount() { window.removeEventListener('scroll', this.handleScroll) }

  handleScroll = () => {
    this.setState({ scrollYPosition: window.scrollY })
  }

  listenEnterKeyMessage = (event) => {
    if (event.key === 'Enter') {
      this.createMessage(event)
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      errorDisplay: false
    })
  }

  async handleError(errors) {
    await this.setState({
      loading: false,
      errors: errors,
      errorDisplay: true
    })
    this.bottom.scrollIntoView({ behavior: 'smooth' })
  }

  createMessage = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.state.newMessage.length === 0 || this.state.newMessage.length > 1000) {
      this.handleError(['The message cannot be empty or exceed 1000 characters!'])
    } else {
      const path = `/api/v1/conversations/${this.props.location.state.id}/messages`
      const payload = {
        body: this.state.newMessage,
        conversation_id: this.props.location.state.id,
        user_id: this.props.id
      }
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.post(path, payload, { headers: headers })
        .then(() => {
          this.setState({ errorDisplay: false })
          window.location.reload()
        })
        .catch(error => {
          this.handleError(error.response.data.error)
        })
    }
  }

  render() {
    let messages, errorDisplay, messageLength, boxShadow

    boxShadow = this.state.scrollYPosition > 0 ?  '0 0 20px -5px rgba(0,0,0,.2)' : 'none'

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

    if (this.state.messages.length < 1) {
      messages = (
        <p style={{ 'textAlign': 'center', 'fontStyle': 'italic' }}>
          You don't have any messages in this conversation (yet).
        </p>
      )
    } else {
      messages = (
        this.state.messages.map(message => {
          let textAlign, flexDirection, margin, border

          if (this.props.username === message.user.nickname) {
            textAlign = 'right'
            flexDirection = 'row-reverse'
            margin = 'auto 0 auto auto'
            border = '1rem 1rem 0 1rem'
          } else {
            textAlign = 'left'
            flexDirection = 'row'
            margin = '0'
            border = '1rem 1rem 1rem 0'
          }
          return (
            <div key={this.state.messages.indexOf(message)} style={{ 'textAlign': textAlign }} data-cy='all-messages-individual-conversation'>
              <div style={{ 'display': 'flex', 'flexDirection': flexDirection, 'marginBottom': '0.5rem', 'alignItems': 'center' }}>
                <Image src={message.user.avatar === null ? `https://ui-avatars.com/api/?name=${message.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : message.user.avatar} size='mini' style={{ 'borderRadius': '50%', 'height': '2rem', 'width': '2rem' }}></Image>
                <p style={{ 'color': '#c90c61', 'margin': '0 0.5rem' }}>
                  <strong>
                    {message.user.nickname}
                  </strong>
                </p>
              </div>
              <div style={{ 'backgroundColor': '#eeeeee', 'margin': margin, 'borderRadius': border, 'padding': '1rem', 'height': 'min-content', 'width': 'fit-content', 'maxWidth': '70%' }}>
                <p>
                  {message.body}
                </p>
              </div>
              <p style={{ 'fontSize': 'small', 'marginBottom': '1rem' }}>
                {moment(message.created_at).format(timeFormat(message.created_at))}
              </p>
            </div>
          )
        })
      )
    }

    return (
      <>
        <div style={{ 'margin': '0 auto', 'padding': '5vw 1.5rem 1rem', 'background': 'white', 'position': 'fixed', 'top': '10vh', 'overflow': 'hidden', 'width': '100%', 'zIndex': '100', 'boxShadow': boxShadow }}>
          <div className='max-width-wrapper' style={{'display': 'flex', 'alignItems': 'center'}}>
            <Icon name='arrow left' size='large' style={{ 'color': '#c90c61', 'cursor': 'pointer' }} onClick={() => {this.props.history.push('/messenger')}} />
            <div style={{'display': 'inline', 'margin': 'auto'}}>
              <Header as='h2'>
                <Image src={this.props.location.state.user.avatar === null ? `https://ui-avatars.com/api/?name=${this.props.location.state.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : this.props.location.state.user.avatar} size='mini' style={{ 'borderRadius': '50%', 'height': '2rem', 'width': '2rem', 'marginTop': '0' }}/>
                {this.props.location.state.user.nickname}
              </Header>
            </div>
            <Icon name='trash alternate outline' size='large' style={{ 'color': '#c90c61' }} />
          </div>
        </div>
        <Container className='messenger-wrapper' style={{ 'marginBottom': '100px' }}>
          <Divider />
          <div className='single-conversation-wrapper'>
            {messages}
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
                    onClick={this.createMessage}
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
  id: state.reduxTokenAuth.currentUser.attributes.id
})

export default connect(mapStateToProps)(Conversation)
