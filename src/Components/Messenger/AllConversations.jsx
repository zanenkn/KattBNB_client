import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Image, Header, Grid, Divider } from 'semantic-ui-react'
import moment from 'moment'
import axios from 'axios'

class AllConversations extends Component {

  state = {
    conversations: ''
  }

  componentDidMount() {
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    const path = `/api/v1/conversations?user_id=${this.props.id}`
    axios.get(path, { headers: headers })
      .then(response => {
        const sortedResponse = response.data.sort(function (a, b) {
          let dateA = new Date(a.msg_created), dateB = new Date(b.msg_created)
          return dateB - dateA
        })
        this.setState({ conversations: sortedResponse })
      })
  }

  render() {
    let messages

    if (this.state.conversations.length < 1) {
      messages = (
        <p>
          You don't have any messages (yet).
        </p>
      )
    } else {
      messages = (
        this.state.conversations.map(conversation => {
          let other_user, time_format, today, conversation_date

          today = new Date()
          conversation_date = new Date(conversation.msg_created)
          conversation.user1.id === this.props.id ? other_user = conversation.user2 : other_user = conversation.user1

          if (conversation_date.getDate() === today.getDate() && conversation_date.getMonth() === today.getMonth() && conversation_date.getYear() === today.getYear()) {
            time_format = 'k:mm'
          } else if (conversation_date.getYear() !== today.getYear()) {
            time_format = 'll'
          } else {
            time_format = 'D MMM k:mm'
          }

          return (
            <div key={conversation.id} id={conversation.id} data-cy='all-messages'>
              <Divider />
              <Grid columns='equal'>
                <Grid.Column width={4}>
                  <Image src={other_user.avatar === null ? `https://ui-avatars.com/api/?name=${other_user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : other_user.avatar} size='mini' style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem' }}></Image>
                </Grid.Column>
                <Grid.Column width={8}>
                  <p>{other_user.nickname}</p>
                  <p style={{ 'whiteSpace': 'nowrap', 'height': '2rem', 'overflow': 'hidden', 'textOverflow': 'ellipsis' }}>
                    {conversation.msg_body === null ? '' : conversation.msg_body}
                  </p>

                </Grid.Column>
                <Grid.Column width={4}>
                  <p>{conversation.msg_created === null ? 'No messages' : moment(conversation.msg_created).format(time_format)}</p>
                </Grid.Column>
              </Grid>
            </div>
          )
        })
      )
    }
    return (
      <>
        <Header as='h1'>
          Messages
        </Header>
        {messages}
      </>
    )
  }
}

const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default connect(mapStateToProps)(AllConversations)
