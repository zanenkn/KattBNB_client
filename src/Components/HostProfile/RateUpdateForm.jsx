import React, { Component } from 'react'
import axios from 'axios'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

class RateUpdateForm extends Component {
  state = {
    errorDisplay: false,
    errors: '',
    loading: false,
    newRate: this.props.rate
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  updateRate = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.state.newRate !== '' && this.state.newRate !== this.props.rate && this.state.newRate >= 0.01) {
      const path = `/api/v1/host_profiles/${this.props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = { price_per_day_1_cat: this.state.newRate }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false
          })
          window.alert('Your daily rate for 1 cat was succesfully updated!')
          window.location.reload()
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    } else {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['The field is blank, unchanged or the number is invalid!']
      })
    }
  }

  listenEnterRateUpdate = (event) => {
    if (event.key === 'Enter') {
      this.updateRate(event)
    }
  }

  render() {
    let errorDisplay
    let rateFormSubmitButton

    if (this.state.loading) {
      rateFormSubmitButton = (
        <Button loading id='rate-submit-button' className='submit-button'>Save</Button>
      )
    } else {
      rateFormSubmitButton = (
        <Button id='rate-submit-button' className='submit-button' onClick={this.updateRate}>Save</Button>
      )
    }

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
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
            value={this.state.newRate}
            onChange={this.onChangeHandler}
            onKeyPress={this.listenEnterRateUpdate}
          />
        </Form>
        {errorDisplay}
        <div className='button-wrapper'>
          <Button secondary id='rate-close-button' className='cancel-button' onClick={this.props.closeAllForms}>Close</Button>
          {rateFormSubmitButton}
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  }
}

export default RateUpdateForm
