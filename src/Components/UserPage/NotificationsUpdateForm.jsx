import React, { useState } from 'react'
import { Checkbox, Divider, Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const NotificationsUpdateForm = (props) => {

  const { t, ready } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [messageNotifications, setMessageNotifications] = useState(props.messageNotifications)

  const updateMessageNotification = () => {

  }
  if (ready) {
    return (
      <div style={{ 'maxWidth': '213px' }}>
        <Divider />
        <div style={{ 'display': 'inline-flex' }}>
          <Checkbox style={{ 'marginRight': '1em', 'padding': '0.5em' }} toggle checked={messageNotifications} onClick={() => setMessageNotifications(!messageNotifications)} />
          <label style={{ 'paddingLeft': '1.5em', 'color': messageNotifications ? 'grey' : 'silver', 'fontSize': 'small' }}>Receive notifications for every message</label>
        </div>
        <div className='button-wrapper'>
          <Button secondary className='cancel-button' onClick={() => props.closeLocationAndPasswordForms()}>{t('reusable:cta.close')}</Button>
          <Button id='location-submit-button' className='submit-button' loading={loading} onClick={() => updateMessageNotification()}>{t('reusable:cta.change')}</Button>
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </div>
    )
  } else { return null }
}

export default NotificationsUpdateForm
