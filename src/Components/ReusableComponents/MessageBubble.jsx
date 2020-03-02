import React from 'react'
import { Image } from 'semantic-ui-react'
import timeFormat from '../../Modules/dateFormatting'
import moment from 'moment'

const MessageBubble = (currentUsername, currentAvatar, otherAvatar, message) => {
  let textAlign, flexDirection, margin, border, avatar, nickname, content

  content = (window.navigator.userAgent.includes('Firefox') ? '-moz-fit-content' : 'fit-content')

  if (message.user === null) {
    textAlign = 'left'
    flexDirection = 'row'
    margin = '0'
    border = '1rem 1rem 1rem 0'
    avatar = 'https://ui-avatars.com/api/?name=[x]&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false'
    nickname = 'Deleted user'
  } else if (currentUsername === message.user.nickname) {
    textAlign = 'right'
    flexDirection = 'row-reverse'
    margin = 'auto 0 auto auto'
    border = '1rem 1rem 0 1rem'
    avatar = currentAvatar
    nickname = currentUsername
  } else {
    textAlign = 'left'
    flexDirection = 'row'
    margin = '0'
    border = '1rem 1rem 1rem 0'
    avatar = otherAvatar
    nickname = message.user.nickname
  }

  return (
    <div key={message.id} style={{ 'textAlign': textAlign }} data-cy='all-messages-individual-conversation'>
      <div style={{ 'display': 'flex', 'flexDirection': flexDirection, 'marginBottom': '0.5rem', 'alignItems': 'center' }}>
        <Image src={avatar === null ? `https://ui-avatars.com/api/?name=${nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : avatar} size='mini' style={{ 'borderRadius': '50%', 'height': '2rem', 'width': '2rem' }}></Image>
        <p style={{ 'color': '#c90c61', 'margin': '0 0.5rem' }}>
          <strong>
            {nickname}
          </strong>
        </p>
      </div>
      <div style={{ 'backgroundColor': '#eeeeee', 'margin': margin, 'borderRadius': border, 'padding': '1rem', 'height': 'min-content', 'width': content, 'maxWidth': '70%' }}>
        {message.body === '' ?
          <a href={message.image} target='_blank' rel='noopener noreferrer'><img alt='uploaded file' src={message.image}></img></a>
          : <p>{message.body} </p>
        }
      </div>
      <p style={{ 'fontSize': 'small', 'marginBottom': '1rem' }}>
        {moment(message.created_at).format(timeFormat(message.created_at))}
      </p>
    </div>
  )
}

export default MessageBubble
