import React, { Component } from 'react'
import axios from 'axios'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

class SupplementUpdateForm extends Component {

  state = {
    errorDisplay: false,
    errors: '',
    loading: false,
    newSupplement: this.props.supplement
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  updateSupplement = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.state.newSupplement !== '' && this.state.newSupplement !== this.props.supplement && this.state.newSupplement >= 0) {
      const path = `/api/v1/host_profiles/${this.props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = { supplement_price_per_cat_per_day: this.state.newSupplement }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false
          })
          window.alert('Your supplement rate for 1 cat was succesfully updated!')
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

  listenEnterSupplementUpdate = (event) => {
    if (event.key === 'Enter') {
      this.updateSupplement(event)
    }
  }

  render() {
    let errorDisplay

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
          Enter how much you would like to get paid per an extra cat per day.
        </p>
        <Form id='update-supplement' style={{ 'margin': 'auto', 'maxWidth': '194px' }}>
          <Form.Input
            required
            type='number'
            id='newSupplement'
            value={this.state.newSupplement}
            onChange={this.onChangeHandler}
            onKeyPress={this.listenEnterSupplementUpdate}
          />
        </Form>
        {errorDisplay}
        <div className='button-wrapper'>
          <Button secondary id='supplement-close-button' className='cancel-button' onClick={this.props.closeAllForms}>Close</Button>
          <Button id='supplement-submit-button' className='submit-button' loading={this.state.loading ? true : false} onClick={this.updateSupplement}>Save</Button>
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  }
}

export default SupplementUpdateForm
