import React, { useState } from 'react'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import { useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

const SupplementUpdateForm = (props) => {

  const { t, ready } = useTranslation('SupplementUpdateForm')

  const [errorDisplay, setErrorDisplay] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [newSupplement, setNewSupplement] = useState(props.supplement)

  const updateSupplement = () => {
    const lang = detectLanguage()
    setLoading(true)
    if (window.navigator.onLine === false) {
      setLoading(false)
      setErrorDisplay(true)
      setErrors(['reusable:errors:window-navigator'])
    } else {
      if (newSupplement !== '' && newSupplement !== props.supplement && newSupplement >= 0) {
        const path = `/api/v1/host_profiles/${props.id}`
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        const payload = {
          supplement_price_per_cat_per_day: newSupplement,
          locale: lang
        }
        axios.patch(path, payload, { headers: headers })
          .then(() => {
            window.alert(t('SupplementUpdateForm:update-success'))
            props.setElement('supplement', newSupplement)
            props.closeAllForms()
            setErrorDisplay(false)
            setErrors([])
          })
          .catch(error => {
            if (error.response.status === 500) {
              setLoading(false)
              setErrorDisplay(true)
              setErrors(['reusable:errors:500'])
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'))
              wipeCredentials('/')
            } else {
              setLoading(false)
              setErrorDisplay(true)
              setErrors([error.response.data.error])
            }
          })
      } else {
        setLoading(false)
        setErrorDisplay(true)
        setErrors(['reusable:errors:update-number-fields'])
      }
    }
  }

  if (ready) {
    return (
      <>
        <Divider />
        <p className='small-centered-paragraph'>
          {t('SupplementUpdateForm:main-title')}
        </p>
        <Form id='update-supplement' style={{ 'margin': 'auto', 'maxWidth': '194px' }}>
          <Form.Input
            required
            type='number'
            id='newSupplement'
            value={newSupplement}
            onChange={e => setNewSupplement(e.target.value)}
            onKeyPress={e => { e.key === 'Enter' && updateSupplement() }}
          />
        </Form>
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
          <Button secondary id='supplement-close-button' className='cancel-button' onClick={props.closeAllForms}>{t('reusable:cta:close')}</Button>
          <Button id='supplement-submit-button' className='submit-button' disabled={loading} loading={loading} onClick={() => updateSupplement()}>{t('reusable:cta:save')}</Button>
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  } else { return <Spinner /> }
}

export default SupplementUpdateForm
