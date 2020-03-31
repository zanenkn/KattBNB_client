import React, { useState } from 'react'
import { Checkbox, Divider, Button, Message } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'

const NotificationsUpdateForm = (props) => {

  const { t, ready } = useTranslation('NotificationsUpdateForm')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [messageNotifications, setMessageNotifications] = useState(props.messageNotifications)

  const updateMessageNotification = () => {
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.removeItem('access-token')
      window.localStorage.removeItem('token-type')
      window.localStorage.removeItem('client')
      window.localStorage.removeItem('uid')
      window.localStorage.removeItem('expiry')
      window.location.replace('/login')
    }
    else if (messageNotifications === props.messageNotifications) {
      setErrorDisplay(true)
      setErrors(['NotificationsUpdateForm:update-error'])
    } else {
      setLoading(true)
      const lang = detectLanguage()
      const path = '/api/v1/auth/'
      const payload = {
        message_notification: messageNotifications,
        locale: lang
      }
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload, { headers: headers })
        .then(() => {
          window.alert(t('NotificationsUpdateForm:update-success'))
          props.setElement('messageNotifications', messageNotifications)
          props.closeLocationAndPasswordForms()
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }

  if (ready) {
    return (
      <div style={{ 'maxWidth': '213px' }}>
        <Divider />
        <div style={{ 'display': 'inline-flex' }}>
          <div className='toggle' onClick={() => setMessageNotifications(!messageNotifications)} >
            <Checkbox style={{ 'marginRight': '1em', 'padding': '0.5em' }} toggle checked={messageNotifications} />
          </div>
          <label style={{ 'paddingLeft': '1.5em', 'color': messageNotifications ? 'grey' : 'silver', 'fontSize': 'small' }}>{t('NotificationsUpdateForm:label')}</label>
        </div>
        {errorDisplay &&
          <Message negative >
            <Message.Header style={{ 'textAlign': 'center' }} >{t('reusable:errors:action-error-header')}</Message.Header>
            <ul id='message-error-list'>
              {errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        }
        <div className='button-wrapper'>
          <Button secondary className='cancel-button' onClick={() => props.closeLocationAndPasswordForms()}>{t('reusable:cta.close')}</Button>
          <Button id='notifications-submit-button' className='submit-button' loading={loading} disabled={loading} onClick={() => updateMessageNotification()}>{t('reusable:cta.change')}</Button>
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </div>
    )
  } else { return <Spinner /> }
}

export default NotificationsUpdateForm
