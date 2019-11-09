import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Form, Button, Message } from 'semantic-ui-react'
import moment from 'moment'
import axios from 'axios'

class RequestToBook extends Component {

  state = {
    message: '',
    loading: false,
    errorDisplay: false,
    errors: ''
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  createBooking = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.state.message === '') {
      this.setState({
        loading: false,
        errors: ['Writting a message to the host is obligatory!'],
        errorDisplay: true
      })
    } else {
      let booking = []
      let startDate = this.props.location.state.checkInDate
      let stopDate = this.props.location.state.checkOutDate
      let currentDate = startDate
      while (currentDate <= stopDate) {
        booking.push(currentDate)
        currentDate = currentDate + 86400000
      }
      const path = '/api/v1/bookings'
      const payload = {
        number_of_cats: this.props.location.state.numberOfCats,
        message: this.state.message,
        dates: booking,
        host_nickname: this.props.location.state.nickname,
        user_id: this.props.id
      }
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.post(path, payload, { headers: headers })
        .then(() => {
          this.setState({ errorDisplay: false })
          window.alert('You have successfully created a booking!')
          //     setTimeout(function () { window.location.replace('/user-page') }, 500)
        })
        .catch(error => {
          this.setState({
            loading: false,
            errors: error.response.data.error,
            errorDisplay: true
          })
        })
    }
  }

  render() {
    let checkIn = moment(this.props.location.state.checkInDate).format('l')
    let checkOut = moment(this.props.location.state.checkOutDate).format('l')
    let errorDisplay

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header>Booking could not be requested because of following error(s):</Message.Header>
          <ul>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    return (
      <>
        <Header>
          Request to book
        </Header>
        <p>
          You are requesting a booking for {this.props.location.state.numberOfCats} cat with {this.props.location.state.nickname} during the dates of {checkIn} - {checkOut}.
        </p>
        <Form>
          <Form.TextArea
            label='Message'
            placeholder='Message'
            required
            id='message'
            value={this.state.message}
            onChange={this.onChangeHandler}
          />
        </Form>
        {errorDisplay}
        <Button
          style={{ 'marginTop': '0' }}
          onClick={this.createBooking}
        >
          Request to book
      </Button>
      </>
    )
  }
}

const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default connect(mapStateToProps)(RequestToBook)
