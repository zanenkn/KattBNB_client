import React, { useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

const RateUpdateForm = (props) => {

  const { t } = useTranslation('RateUpdateForm')

  const [errorDisplay, setErrorDisplay] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [newRate, setNewRate] = useState(props.rate)

  const updateRate = () => {
    setLoading(true)
    if (newRate !== '' && newRate !== props.rate && newRate >= 0.01) {
      const path = `/api/v1/host_profiles/${props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = { price_per_day_1_cat: newRate }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          window.alert(t('RateUpdateForm:update-success'))
          props.setElement('rate', newRate)
          props.closeAllForms()
        })
        .catch(error => {
          setLoading(false)
          setErrorDisplay(true)
          setErrors([error.response.data.errors.full_messages])
        })
    } else {
      setLoading(false)
      setErrorDisplay(true)
      setErrors(['reusable:errors:update-number-fields'])
    }
  }

  return (
    <>
      <Divider />
      <p className='small-centered-paragraph'>
        {t('RateUpdateForm:main-title')}
      </p>
      <Form id='update-rate' style={{ 'margin': 'auto', 'maxWidth': '194px' }}>
        <Form.Input
          required
          type='number'
          id='newRate'
          value={newRate}
          onChange={e => setNewRate(e.target.value)}
          onKeyPress={e => { e.key === 'Enter' && updateRate() }}
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
        <Button secondary id='rate-close-button' className='cancel-button' onClick={props.closeAllForms}>{t('reusable:cta:close')}</Button>
        <Button id='rate-submit-button' className='submit-button' disabled={loading} loading={loading} onClick={() => updateRate()}>{t('reusable:cta:save')}</Button>
      </div>
      <Divider style={{ 'marginBottom': '2rem' }} />
    </>
  )
}

export default RateUpdateForm
