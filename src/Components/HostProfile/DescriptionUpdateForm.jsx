import React, { Component } from 'react'
import axios from 'axios'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

class DescriptionUpdateForm extends Component {

  state = {
    errorDisplay: false,
    errors: '',
    loading: false,
    newDescription: this.props.description
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  updateDescription = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.state.newDescription !== '' && this.state.newDescription !== this.props.description) {
      const path = `/api/v1/host_profiles/${this.props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = { description: this.state.newDescription }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false
          })
          window.alert('Your description was succesfully updated!')
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
        errors: ['The field is blank or unchanged!']
      })
    }
  }

  render() {
    let errorDisplay, descriptionFormSubmitButton

    if (this.state.loading) {
      descriptionFormSubmitButton = (
        <Button loading id='description-submit-button' className='submit-button'>Save</Button>
      )
    } else {
      descriptionFormSubmitButton = (
        <Button id='description-submit-button' className='submit-button' onClick={this.updateDescription}>Save</Button>
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
          Please tell us a little about yourself and your experience with cats. This will be displayed at the search.
        </p>
        <Form id='update-description'>
          <Form.TextArea
            required
            id='newDescription'
            value={this.state.newDescription}
            onChange={this.onChangeHandler}
          />
        </Form>
        {errorDisplay}
        <div className='button-wrapper'>
          <Button secondary id='description-close-button' className='cancel-button' onClick={this.props.closeAllForms}>Close</Button>
          {descriptionFormSubmitButton}
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  }
}

export default DescriptionUpdateForm
