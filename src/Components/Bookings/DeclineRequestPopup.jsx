import React, { Component } from 'react'
import { Header, Form, Button, Message } from 'semantic-ui-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

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
      if(this.state.message !== ''){
        const path = `/api/v1/bookings/${this.props.id}`
        const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
        }
        const payload = {
          host_message: this.state.message,
          status: "declined"
        }
        const { history } = this.props
        axios.patch(path, payload, { headers: headers })
        .then(() => {
          history.push('/all-bookings')
        })
        .catch(error => {
          debugger
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
          errors: ["Message can't be blank!"]
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
            style={{ 'minHeight': '150px' }}
            label='Message'
            placeholder='Let them know why..'
            required
            id='message'
            value={this.state.message}
            onChange={this.onChangeHandler}
          />
        </Form>
        {errorDisplay}
        <Button loading={this.state.loading ? true : false} onClick={this.declineBooking}>Decline</Button>
      </>
    )
  }
}

export default withRouter(DeclineRequestPopup)