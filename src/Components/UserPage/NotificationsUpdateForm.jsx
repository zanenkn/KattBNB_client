import React, { useState } from 'react'
import { Checkbox, Divider, Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const NotificationsUpdateForm = (props) => {

  const { t, ready } = useTranslation()
  const [loading, setLoading] = useState(false)

  const updateMessageNotification = () => {

  }

  return (
    <>
      <div style={{ 'display': 'inline-flex', 'paddingTop': '1em' }}>
        <Checkbox toggle />
        <label style={{ 'paddingLeft': '1.3em' }}>Receive notifications for every message</label>
      </div>
      <div className='button-wrapper'>
        <Button secondary className='cancel-button' onClick={() => props.closeLocationAndPasswordForms()}>{t('reusable:cta.close')}</Button>
        <Button id='location-submit-button' className='submit-button' loading={loading} onClick={() => updateMessageNotification()}>{t('reusable:cta.change')}</Button>
      </div>
    </>
  )
}

export default NotificationsUpdateForm
