import React, { useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

const DescriptionUpdateForm = (props) => {

  const { t, ready } = useTranslation('DescriptionUpdateForm')

  const [errorDisplay, setErrorDisplay] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [newDescription, setNewDescription] = useState(props.description)

  const updateDescription = () => {
    setLoading(true)
    if (newDescription !== '' && newDescription !== props.description) {
      const path = `/api/v1/host_profiles/${props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = { description: newDescription }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          window.alert(t('DescriptionUpdateForm:update-success'))
          props.setElement('description', newDescription)
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
      setErrors(['DescriptionUpdateForm:update-error'])
    }
  }

  if (ready) {
    return (
      <>
        <Divider />
        <p className='small-centered-paragraph'>
          {t('DescriptionUpdateForm:main-title')}
        </p>
        <Form id='update-description'>
          <Form.TextArea
            required
            id='newDescription'
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
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
          <Button secondary id='description-close-button' className='cancel-button' onClick={props.closeAllForms}>{t('reusable:cta:close')}</Button>
          <Button id='description-submit-button' className='submit-button' disabled={loading} loading={loading} onClick={() => updateDescription()}>{t('reusable:cta:save')}</Button>
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  } else { return <Spinner /> }
}

export default DescriptionUpdateForm
