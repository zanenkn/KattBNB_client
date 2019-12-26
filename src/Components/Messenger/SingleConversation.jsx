import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment'
import timeFormat from '../../Modules/dateFormatting'
import { Image, Form, Button, Message } from 'semantic-ui-react'

class Conversation extends Component {
  state = {
    messages: '',
    newMessage: '',
    loading: false,
    errorDisplay: false,
    errors: ''
  }

  componentDidMount() {
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
      })
  }

  listenEnterKeyMessage = (event) => {
    if (event.key === 'Enter') {
      this.createMessage(event)
    }
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  createMessage = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.state.newMessage.length > 1000) {
      this.setState({
        loading: false,
        errors: ['The message cannot exceed 1000 characters!'],
        errorDisplay: true
      })
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
          this.setState({
            loading: false,
            errors: error.response.data.error,
            errorDisplay: true
          })
        })
    }
  }

  render() {
    let messages, errorDisplay

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative style={{ 'width': 'inherit' }} >
          <Message.Header style={{ 'textAlign': 'center' }} >Update action could not be completed because of following error(s):</Message.Header>
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
          return (
            <div key={this.state.messages.indexOf(message)} style={{ 'textAlign': (this.props.username === message.user.nickname ? 'right' : 'left') }}>
              <Image src={message.user.avatar === null ? `https://ui-avatars.com/api/?name=${message.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : message.user.avatar} size='mini' style={{ 'borderRadius': '50%', 'margin': 'auto auto auto 0', 'maxWidth': '50px', 'width': '-webkit-fill-available' }}></Image>
              {message.user.nickname}
              {message.body}
              {moment(message.created_at).format(timeFormat(message.created_at))}
            </div>
          )
        })
      )
    }

    return (
      <>
        {messages}
        {errorDisplay}
        <Form style={{ 'maxWidth': '194px' }}>
          <Form.Input
            required
            id='newMessage'
            value={this.state.newMessage}
            onChange={this.onChangeHandler}
            placeholder='Say something..'
            onKeyPress={this.listenEnterKeyMessage}
          />
          <Button id='message-submit-button' className='submit-button' loading={this.state.loading ? true : false} onSubmit={this.createMessage}>Change</Button>
        </Form>
      </>
    )
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id
})

export default connect(mapStateToProps)(Conversation)
