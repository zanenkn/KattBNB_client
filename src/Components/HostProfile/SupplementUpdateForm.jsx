import React, { useState } from 'react'
import axios from 'axios'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

const SupplementUpdateForm = (props) => {
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [newSupplement, setNewSupplement] = useState(props.supplement)

  const updateSupplement = () => {
    setLoading(true)
    if (newSupplement !== '' && newSupplement !== props.supplement && newSupplement >= 0) {
      const path = `/api/v1/host_profiles/${props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = { supplement_price_per_cat_per_day: newSupplement }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          window.alert('Your supplement rate for 1 cat was succesfully updated!')
          props.setElement('supplement', newSupplement)
          props.closeAllForms()
        })
        .catch(error => {
          setLoading(false)
          setErrorDisplay(false)
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
        Enter how much you would like to get paid per an extra cat per day.
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
          <Message.Header style={{ 'textAlign': 'center' }} >Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      }
      <div className='button-wrapper'>
        <Button secondary id='supplement-close-button' className='cancel-button' onClick={props.closeAllForms}>Close</Button>
        <Button id='supplement-submit-button' className='submit-button' loading={loading} onClick={() =>updateSupplement()}>Save</Button>
      </div>
      <Divider style={{ 'marginBottom': '2rem' }} />
    </>
  )

}

export default SupplementUpdateForm
