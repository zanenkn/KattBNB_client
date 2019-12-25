import React, { Component } from 'react'
import axios from 'axios'

class Conversation extends Component {
  state = {
    messages: ''
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

  render() {
    let messages

    if (this.state.messages.length < 1) {
      messages = (
        <p style={{ 'textAlign': 'center', 'fontStyle': 'italic' }}>
          You don't have any messages in this conversation (yet).
        </p>
      )
    } else {
      messages = (
        this.state.messages.map(message => {
          return(
            <>
            {message.user.nickname}
            {message.body}
            {message.created_at}
            </>
          )
        })
      )
    }
    return(
      <>
        {messages}
      </>
    )
  }
}

export default Conversation