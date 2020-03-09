import React, { useState } from 'react'
import axios from 'axios'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

const MaxCatsUpdateForm = (props) => {
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMaxCats, setNewMaxCats] = useState(props.maxCats)

  const updateMaxCats = () => {
    setLoading(true)
    if (newMaxCats !== '' && parseFloat(newMaxCats) !== props.maxCats && parseFloat(newMaxCats) >= 1) {
      const path = `/api/v1/host_profiles/${props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = { max_cats_accepted: newMaxCats }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          window.alert('Your maximum amount of cats accepted was succesfully updated!')
          props.setElement('maxCats', newMaxCats)
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
      setErrors(['The field is blank, unchanged or the number is invalid!'])
    }
  }

  return (
    <>
      <Divider />
      <p className='small-centered-paragraph'>
        Enter maximum number of cats from the same household you would like to host.
          </p>
      <Form id='update-maxCats' style={{ 'margin': 'auto', 'maxWidth': '194px' }}>
        <Form.Input
          required
          type='number'
          id='newMaxCats'
          value={newMaxCats}
          onChange={(e) => setNewMaxCats(e.target.value)}
          onKeyPress={e => { e.key === 'Enter' && updateMaxCats() }}
        />
      </Form>
      {errorDisplay &&
        <Message negative >
          <Message.Header style={{ 'textAlign': 'center' }} >Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      }
      <div className='button-wrapper'>
        <Button secondary id='maxCats-close-button' className='cancel-button' onClick={props.closeAllForms}>Close</Button>
        <Button id='maxCats-submit-button' className='submit-button' disabled={loading} loading={loading} onClick={() => updateMaxCats()}>Save</Button>
      </div>
      <Divider style={{ 'marginBottom': '2rem' }} />
    </>
  )

}

export default MaxCatsUpdateForm
