import React, { useState } from 'react'
import axios from 'axios'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

const DescriptionUpdateForm = (props) => {

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
          window.alert('Your description was succesfully updated!')
          window.location.reload()
          setLoading(false)
          errorDisplay(false)

        })
        .catch(error => {
          setLoading(false)
          setErrorDisplay(true)
          setErrors(error.response.data.errors.full_messages)
        })
    } else {
      setLoading(false)
      setErrorDisplay(true)
      setErrors(['The field is blank or unchanged!'])
    }
  }

  return (
    <>
      <Divider />
      <p className='small-centered-paragraph'>
        Please tell us a little about yourself, your house or apartment and your experience with cats. This will be displayed at the search.
        </p>
      <Form id='update-description'>
        <Form.TextArea
          required
          id='newDescription'
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
        />
      </Form>
      {errorDisplay ?
        <Message negative >
          <Message.Header style={{ 'textAlign': 'center' }} >Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      : () => { }}
      <div className='button-wrapper'>
        <Button secondary id='description-close-button' className='cancel-button' onClick={props.closeAllForms}>Close</Button>
        <Button id='description-submit-button' className='submit-button' loading={loading} onClick={() => updateDescription()}>Save</Button>
      </div>
      <Divider style={{ 'marginBottom': '2rem' }} />
    </>
  )
}

export default DescriptionUpdateForm
