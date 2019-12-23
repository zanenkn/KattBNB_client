import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Image, Header, Grid } from 'semantic-ui-react'
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
    const path= `/api/v1/conversations?user_id=${this.props.id}`

    axios.get(path, { headers: headers })
      .then(response => {
        const sortedResponse = response.data.sort(function (a, b) {
          let dateA = new Date(a.last_msg.created_at), dateB = new Date(b.last_msg.created_at);
          return dateB - dateA
        })

        this.setState({ 
          conversations: sortedResponse 
        })
    })
  }

  render() {
    let messages
    if (this.state.conversations.length < 1) {
      messages = (
        'no messages'
      )
    } else {
      messages = (
      this.state.conversations.map(conversation => {
        let other_user
        conversation.user1.id === this.props.id ? other_user=conversation.user2 : other_user=conversation.user1

        return (
          <div key={conversation.id}>
            <Grid columns='equal'>
              <Grid.Column>
                <Image src={other_user.avatar === null ? `https://ui-avatars.com/api/?name=${other_user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : other_user.avatar} size='mini' style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem' }}></Image>
              </Grid.Column>
              <Grid.Column>
                <p>{other_user.nickname}</p>
                <p>{conversation.last_msg.body}</p>
              </Grid.Column>
              <Grid.Column>
                <p>{moment(conversation.last_msg.created_at).format('lll')}</p>
              </Grid.Column>
            </Grid>
          </div> 
        )
      })
      )
    }
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          Messages
        </Header>
        {messages}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
})

export default connect(mapStateToProps)(AllConversations)