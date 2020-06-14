import React from 'react'
import Spinner from './Spinner'
import { useTranslation } from 'react-i18next'
import { Image } from 'semantic-ui-react'
import timeFormat from '../../Modules/dateFormatting'
import { detectLanguage } from '../../Modules/detectLanguage'
import moment from 'moment'

const MessageBubble = (props) => {

  const { t, ready } = useTranslation('MessageBubble')
  const lang = detectLanguage()

  let textAlign, flexDirection, margin, border, avatar, nickname, content
  content = (window.navigator.userAgent.includes('Firefox') ? '-moz-fit-content' : 'fit-content')

  const onImageLoad = (e) => {
    props.scrollDown()
    e.target.naturalHeight > e.target.naturalWidth ? e.target.classList.add('portrait-img') : e.target.classList.add('landscape-img')
  }

  if (props.message.user === null) {
    textAlign = 'left'
    flexDirection = 'row'
    margin = '0'
    border = '1rem 1rem 1rem 0'
    avatar = 'https://ui-avatars.com/api/?name=[x]&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false'
    nickname = t('MessageBubble:nickname-deleted')
  } else if (props.currentUsername === props.message.user.nickname) {
    textAlign = 'right'
    flexDirection = 'row-reverse'
    margin = 'auto 0 auto auto'
    border = '1rem 1rem 0 1rem'
    avatar = props.currentAvatar
    nickname = props.currentUsername
  } else {
    textAlign = 'left'
    flexDirection = 'row'
    margin = '0'
    border = '1rem 1rem 1rem 0'
    avatar = props.otherAvatar
    nickname = props.message.user.nickname
  }

  if (ready) {
    moment.locale(lang)

    return (
      <div style={{ 'textAlign': textAlign }} data-cy='all-messages-individual-conversation'>
        <div style={{ 'display': 'flex', 'flexDirection': flexDirection, 'marginBottom': '0.5rem', 'alignItems': 'center' }}>
          <Image src={avatar === null ? `https://ui-avatars.com/api/?name=${nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : avatar} size='mini' style={{ 'borderRadius': '50%', 'height': '2rem', 'width': '2rem' }}></Image>
          <p style={{ 'color': '#c90c61', 'margin': '0 0.5rem' }}>
            <strong>
              {nickname}
            </strong>
          </p>
        </div>
        <div style={{
          'backgroundColor': '#eeeeee',
          'margin': margin,
          'borderRadius': border,
          'display': props.message.body === '' && 'flex',
          'justifyContent': props.message.body === '' && 'center',
          'alignItems': props.message.body === '' && 'center',
          'overflow': props.message.body === '' && 'hidden',
          'padding': props.message.body === '' ? 'none' : '1rem',
          'height': 'min-content',
          'width': content,
          'maxWidth': '70%'
        }}>
          {props.message.body === '' ?
            <a href={props.message.image} target='_blank' rel='noopener noreferrer' style={{ 'lineHeight': '0' }}>
              <img
                onLoad={(e) => onImageLoad(e)}
                alt={t('MessageBubble:image-alt-txt')}
                style={{ 'flexShrink': '0', 'minWidth': '100%', 'minHeight': '100%' }}
                src={props.message.image}>
              </img>
            </a>
            : <p>{props.message.body} </p>
          }
        </div>
        <p style={{ 'fontSize': 'small', 'marginBottom': '1rem' }}>
          {moment(props.message.created_at).format(timeFormat(props.message.created_at))}
        </p>
      </div>
    )
  } else { return <Spinner /> }
}

export default MessageBubble
