import React, { useState } from 'react'
import axios from 'axios'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

const RateUpdateForm = (props) => {
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
          window.alert('Your daily rate for 1 cat was succesfully updated!')
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
      setErrors(['The field is blank, unchanged or the number is invalid!'])
    }
  }

  return (
    <>
      <Divider />
      <p className='small-centered-paragraph'>
        Enter how much you would like to get paid per day when hosting 1 cat.
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
          <Message.Header style={{ 'textAlign': 'center' }} >Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      }
      <div className='button-wrapper'>
        <Button secondary id='rate-close-button' className='cancel-button' onClick={props.closeAllForms}>Close</Button>
        <Button id='rate-submit-button' className='submit-button' disabled={loading} loading={loading} onClick={() => updateRate()}>Save</Button>
      </div>
      <Divider style={{ 'marginBottom': '2rem' }} />
    </>
  )
}

export default RateUpdateForm
