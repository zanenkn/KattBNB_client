import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Image, Header, Grid, Divider, Container } from 'semantic-ui-react'
import timeFormat from '../../Modules/dateFormatting'
import moment from 'moment'
import axios from 'axios'

class AllConversations extends Component {

  state = {
    conversations: '',
    scrollYPosition: 0
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
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

  componentWillUnmount() { window.removeEventListener('scroll', this.handleScroll) }

  handleScroll = () => {
    this.setState({ scrollYPosition: window.scrollY })
  }

  render() {
    let messages, boxShadow

    boxShadow = this.state.scrollYPosition > 0 ?  '0 0 20px -5px rgba(0,0,0,.2)' : 'none'

    if (this.state.conversations.length < 1) {
      messages = (
        <p style={{ 'textAlign': 'center', 'fontStyle': 'italic' }}>
          You don't have any messages (yet).
        </p>
      )
    } else {
      messages = (
        this.state.conversations.map(conversation => {
          let other_user, time_format
          
          conversation.user1.id === this.props.id ? other_user = conversation.user2 : other_user = conversation.user1
          time_format = timeFormat(conversation.msg_created)

          return (
            <div key={conversation.id} id={conversation.id} data-cy='all-messages'
              onClick={() => {
                this.props.history.push({
                  pathname: '/conversation',
                  state: {
                    id: conversation.id
                  }
                })
              }}
            >
              
              <Grid className='conversation-index-wrapper'>
                <Grid.Column width={4} style={{ 'display': 'grid', 'alignContent': 'center', 'paddingLeft': '1.5rem' }}>
                  <Image src={other_user.avatar === null ? `https://ui-avatars.com/api/?name=${other_user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : other_user.avatar} size='mini' style={{ 'borderRadius': '50%', 'margin': 'auto auto auto 0', 'maxWidth': '50px', 'width': '-webkit-fill-available' }}></Image>
                </Grid.Column>
                <Grid.Column width={8}>
                  <p style={{ 'marginBottom': '0', 'color': '#c90c61' }}>
                    <strong>{other_user.nickname}</strong>
                  </p>
                  <p style={{ 'whiteSpace': 'nowrap', 'height': '2rem', 'overflow': 'hidden', 'textOverflow': 'ellipsis' }}>
                    {conversation.msg_body === null ? '' : conversation.msg_body}
                  </p>
                </Grid.Column>
                <Grid.Column width={4} style={{ 'textAlign': 'right', 'paddingRight': '1.5rem' }}>
                  <p style={{ 'fontSize': 'small' }}>{conversation.msg_created === null ? 'No messages' : moment(conversation.msg_created).format(time_format)}</p>
                </Grid.Column>
              </Grid>
              <Divider />
              
            </div>
          )
        })
      )
    }
    return (
      <>
        <div style={{'margin': '0 auto', 'paddingTop': '5vw', 'background': 'white', 'position': 'fixed', 'top': '10vh', 'overflow': 'hidden', 'width': '100%', 'zIndex': '100', 'paddingBottom': '1rem', 'boxShadow': boxShadow }}>
          <Header as='h1'>
            Messages
          </Header>
        </div>
        <div className='messenger-wrapper'>
          <Divider />
          {messages}
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default connect(mapStateToProps)(AllConversations)
