import React, { Component } from 'react'
import withAuth from '../../HOC/withAuth'
import Spinner from '../ReusableComponents/Spinner'
import { connect } from 'react-redux'
import { Image, Header, Grid, Divider, Message } from 'semantic-ui-react'
import timeFormat from '../../Modules/dateFormatting'
import moment from 'moment'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import { withTranslation } from 'react-i18next'

class AllConversations extends Component {

  state = {
    conversations: '',
    scrollYPosition: 0,
    loading: true,
    errorDisplay: false,
    errors: [],
    secondaryStickyStyle: {'boxShadow':'none', 'borderBottom': '1px solid rgba(34,36,38,.15)'}
  }

  componentDidMount() {
    const { t } = this.props
    if (window.navigator.onLine === false) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator']
      })
    } else {
      const lang = detectLanguage()
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const path = `/api/v1/conversations?user_id=${this.props.id}&locale=${lang}`
      axios.get(path, { headers: headers })
        .then(response => {
          const shownConversations = []
          response.data.map(conversation => {
            if (conversation.hidden !== this.props.id) {
              shownConversations.push(conversation)
            }
          })
          const sortedResponse = shownConversations.sort(function (a, b) {
            let dateA = new Date(a.msg_created), dateB = new Date(b.msg_created)
            return dateB - dateA
          })
          this.setState({
            conversations: sortedResponse,
            loading: false,
            errorDisplay: false,
            errors: []
          })
        }).catch(error => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 500) {
            this.setState({
              loading: false,
              errorDisplay: true,
              errors: ['reusable:errors:500']
            })
          } else if (error.response.status === 503) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'))
            wipeCredentials('/')
          } else {
            this.setState({
              loading: false,
              errorDisplay: true,
              errors: error.response.data.error
            })
          }
        })
    }
  }

  handleScroll = (e) => {
    let secondaryStickyStyle = e.target.scrollTop > 0 ? {'boxShadow':'0 0 20px -5px rgba(0,0,0,.2)', 'borderBottom': 'none'} : {'boxShadow':'none', 'borderBottom': '1px solid rgba(34,36,38,.15)'}
    console.log(e.target.scrollTop)
    this.setState({
      secondaryStickyStyle: secondaryStickyStyle
    })
  }

  render() {
    const { t } = this.props
    const lang = detectLanguage()
    let deleted_user = { nickname: t('AllConversations:deleted-user'), profile_avatar: null, location: 'none', id: null }
    moment.locale(lang)

    if (this.state.loading) {
      return <Spinner />
    } else if (this.state.errorDisplay) {
      return (
        <div className='content-wrapper' >
          <Message negative >
            <ul id='message-error-list'>
              {this.state.errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        </div>
      )
    } else {
      return (
        <>
          <div id='secondary-sticky' style={{ 'height': '80px', 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center', ...this.state.secondaryStickyStyle }}>            
          <Header as='h1'>
            {t('AllConversations:header')}
          </Header>
          </div>
          <div className='messenger-wrapper all-conversations' style={{ 'paddingTop': '96px' }} onScroll={this.handleScroll}>
            {this.state.conversations.length < 1 ?
              <p style={{ 'textAlign': 'center', 'fontStyle': 'italic' }}>
                {t('AllConversations:no-messages')}
              </p>
              :
              this.state.conversations.map(conversation => {
                let other_user, time_format
                conversation.user1 === null ? other_user = deleted_user : conversation.user2 === null ? other_user = deleted_user : conversation.user1.id === this.props.id ? other_user = conversation.user2 : other_user = conversation.user1
                time_format = timeFormat(conversation.msg_created)
                return (
                  <div key={conversation.id} id={conversation.id} data-cy='all-messages'
                    onClick={() => {
                      this.props.history.push({
                        pathname: '/conversation',
                        state: {
                          id: conversation.id,
                          user: other_user === null ? deleted_user : other_user
                        }
                      })
                    }}
                  >
                    <Grid className='conversation-index-wrapper'>
                      <Grid.Column width={4} style={{ 'display': 'grid', 'alignContent': 'center', 'paddingLeft': '1.5rem' }}>
                        {other_user.id === null ?
                          <Image src={`https://ui-avatars.com/api/?name=[x]&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`} size='mini' style={{ 'borderRadius': '50%', 'margin': 'auto auto auto 0', 'maxWidth': '50px', 'width': '-webkit-fill-available' }}></Image>
                          : <Image src={other_user.profile_avatar === null ? `https://ui-avatars.com/api/?name=${other_user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : other_user.profile_avatar} size='mini' style={{ 'borderRadius': '50%', 'margin': 'auto auto auto 0', 'maxWidth': '50px', 'width': '-webkit-fill-available' }}></Image>
                        }
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
                        <p style={{ 'fontSize': 'small' }}>{conversation.msg_created === null ? t('AllConversations:no-messages-2') : moment(conversation.msg_created).format(time_format)}</p>
                      </Grid.Column>
                    </Grid>
                    <Divider />
                  </div>
                )
              })
            }
          </div>
        </>
      )
    }
  }
}

const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default withTranslation('AllConversations')(connect(mapStateToProps)(withAuth(AllConversations)))
