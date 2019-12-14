import React, { Component } from 'react'
import axios from 'axios'
import { Divider, Form, Button, Message } from 'semantic-ui-react'

class MaxCatsUpdateForm extends Component {

  state = {
    errorDisplay: false,
    errors: '',
    loading: false,
    newMaxCats: this.props.maxCats
  }

  updateMaxCats = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.state.newMaxCats !== '' && parseFloat(this.state.newMaxCats) !== this.props.maxCats && parseFloat(this.state.newMaxCats) >= 1) {
      const path = `/api/v1/host_profiles/${this.props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = { max_cats_accepted: this.state.newMaxCats }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false
          })
          window.alert('Your maximum amount of cats accepted was succesfully updated!')
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

  listenEnterMaxCatsUpdate = (event) => {
    if (event.key === 'Enter') {
      this.updateMaxCats(event)
    }
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
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
          Enter maximum number of cats from the same household you would like to host.
          </p>
        <Form id='update-maxCats' style={{ 'margin': 'auto', 'maxWidth': '194px' }}>
          <Form.Input
            required
            type='number'
            id='newMaxCats'
            value={this.state.newMaxCats}
            onChange={this.onChangeHandler}
            onKeyPress={this.listenEnterMaxCatsUpdate}
          />
        </Form>
        {errorDisplay}
        <div className='button-wrapper'>
          <Button secondary id='maxCats-close-button' className='cancel-button' onClick={this.props.closeAllForms}>Close</Button>
          <Button id='maxCats-submit-button' className='submit-button' loading={this.state.loading ? true : false} onClick={this.updateMaxCats}>Save</Button>
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  }
}

export default MaxCatsUpdateForm
