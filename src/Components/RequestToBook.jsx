import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Form, Button, Message } from 'semantic-ui-react'
import moment from 'moment'
import axios from 'axios'
import { pricePerDay, total } from '../Modules/PriceCalculations'

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
          window.location.replace('/')
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
    let perDay = pricePerDay(this.props.location.state.hostRate, this.props.location.state.numberOfCats, this.props.location.state.hostSupplement)
    let orderTotal = total(this.props.location.state.hostRate, this.props.location.state.numberOfCats, this.props.location.state.hostSupplement, this.props.location.state.checkInDate, this.props.location.state.checkOutDate)
    let errorDisplay, requestToBookButton

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

    if (this.state.loading) {
      requestToBookButton = (
        <Button loading id='request-to-book-button' className='submit-button' style={{ 'marginTop': '0' }}>Request to book</Button>
      )
    } else {
      requestToBookButton = (
        <Button id='request-to-book-button' className='submit-button' style={{ 'marginTop': '0' }} onClick={this.createBooking}>Request to book</Button>
      )
    }

    return (
      <>
        <Header>
          Request to book
        </Header>
        <p>
          You are requesting a booking for {this.props.location.state.numberOfCats} cat with {this.props.location.state.nickname} during the dates of {checkIn} and {checkOut}. Total cost for this stay will be {orderTotal} kr ({perDay} kr/day).
        </p>
        <Form>
          <Form.TextArea
            label='Message'
            placeholder='Say a few words to the host...'
            required
            id='message'
            value={this.state.message}
            onChange={this.onChangeHandler}
          />
        </Form>
        {errorDisplay}
        <p>
          Upon successfully booking, the cat host will be notified with an email. The cat host has 3 days to accept or decline your request. In any case, you will be notified with an email. If the cat host accepts, you are advised to arrange an appointment and finalize the transaction between each other.
        </p>
        {requestToBookButton}
      </>
    )
  }
}

const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default connect(mapStateToProps)(RequestToBook)
