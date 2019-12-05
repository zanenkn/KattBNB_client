import React, { Component } from 'react'
import { Header, Form, Button, Message } from 'semantic-ui-react'
import axios from 'axios'

class DeclineRequestPopup extends Component {
  state = {
    message: '',
    loading: false,
    errorDisplay: false,
    errors: ''
  }

  declineBooking = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (window.confirm('Do you really want to decline this booking request?')) {
      if (this.state.message !== '' && this.state.message.length < 201) {
        const path = `/api/v1/bookings/${this.props.id}`
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        const payload = {
          host_message: this.state.message,
          status: 'declined'
        }
        axios.patch(path, payload, { headers: headers })
          .then(() => {
            window.location.replace('/all-bookings')
          })
          .catch(error => {
            this.setState({
              loading: false,
              errorDisplay: true,
              errors: error.response.data.error
            })
          })
      } else {
        this.setState({
          loading: false,
          errorDisplay: true,
          errors: ["Message can't be blank or more than 200 characters!"]
        })
      }
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
          <Message.Header textAlign='center'>Request could not be declined because of following error(s):</Message.Header>
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
        <Header as='h2'>
          Decline a request
        </Header>
        <p className='small-centered-paragraph'>
          You are about to decline a booking request from <strong style={{ 'color': '#c90c61' }}>{this.props.nickname}</strong> for the dates of <strong style={{ 'color': '#c90c61' }}>{this.props.startDate}</strong> until <strong style={{ 'color': '#c90c61' }}>{this.props.endDate}</strong>
        </p>
        <Form>
          <Form.TextArea
            style={{ 'minHeight': '120px' }}
            label='Message'
            placeholder='Let them know why..'
            required
            id='message'
            value={this.state.message}
            onChange={this.onChangeHandler}
          />
        </Form>
        <p style={{ 'textAlign': 'end', 'fontSize': 'smaller', 'fontStyle': 'italic' }}>
          Remaining characters: {200 - this.state.message.length}
        </p>
        {errorDisplay}
        <Button id='decline-button' loading={this.state.loading ? true : false} onClick={this.declineBooking}>Decline</Button>
      </>
    )
  }
}

export default DeclineRequestPopup
