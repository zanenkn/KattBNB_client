import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Form, Button, Message, Segment } from 'semantic-ui-react'
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
        errors: ['Please write a message to the host!'],
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
          this.props.history.push({
            pathname: '/successful-request',
            state: {
              numberOfCats: this.props.numberOfCats,
              checkInDate: this.props.checkInDate,
              checkOutDate: this.props.checkOutDate,
              nickname: this.props.hostNickname
            }
          })
          // this.setState({ errorDisplay: false })
          // window.alert('You have successfully requested a booking!')
          // window.location.replace('/')
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
      <div className='content-wrapper' >
        <Header as='h1'>
          Request to book
        </Header>
        <Segment className='whitebox'>
          <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
            You are requesting a booking for <strong style={{ 'color': '#c90c61' }}>{this.props.location.state.numberOfCats} {this.props.location.state.numberOfCats > 1 ? 'cats' : 'cat'}</strong> with <strong style={{ 'color': '#c90c61' }}>{this.props.location.state.nickname}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{checkIn}</strong> until <strong style={{ 'color': '#c90c61' }}>{checkOut}</strong>.
          </p>
          <Form>
            <Form.TextArea
              label='Message'
              placeholder='Say a few words to the host..'
              required
              id='message'
              value={this.state.message}
              onChange={this.onChangeHandler}
            />
          </Form>
          {errorDisplay}
          <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
            By requesting to book, you agree to pay the total cost for this stay:
          </p>
          <Header id='total' as='h3' style={{ 'marginTop': '0', 'marginBottom': '0' }}>
            {orderTotal} kr
          </Header>
          <Header id='total' as='h5' style={{ 'marginTop': '0' }}>
            ({perDay} kr/day)
          </Header>
          {requestToBookButton}
          <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
            <strong style={{ 'color': '#c90c61' }}>{this.props.location.state.nickname}</strong> will have 3 days to accept or decline your booking request and we will let you know by email. Read more about booking process in our FAQ.
          </p>
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default connect(mapStateToProps)(RequestToBook)
