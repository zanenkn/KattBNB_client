import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Form, Button, Message, Segment } from 'semantic-ui-react'
import moment from 'moment'
import axios from 'axios'
import { pricePerDay, total } from '../../Modules/PriceCalculations'

class RequestToBook extends Component {

  state = {
    message: '',
    loading: false,
    errorDisplay: false,
    errors: '',
    checkIn: '',
    checkOut: '',
    perDay: '',
    orderTotal: '',
    numberOfCats: '',
    nickname: ''
  }

  componentDidMount() {
    if (this.props.history.location.state === undefined || this.props.history.action === 'POP') {
      this.props.history.push({ pathname: '/' })
    } else {
      this.setState({
        checkIn: moment(this.props.location.state.checkInDate).format('l'),
        checkOut: moment(this.props.location.state.checkOutDate).format('l'),
        perDay: pricePerDay(this.props.location.state.hostRate, this.props.location.state.numberOfCats, this.props.location.state.hostSupplement),
        orderTotal: total(this.props.location.state.hostRate, this.props.location.state.numberOfCats, this.props.location.state.hostSupplement, this.props.location.state.checkInDate, this.props.location.state.checkOutDate),
        numberOfCats: this.props.location.state.numberOfCats,
        nickname: this.props.location.state.nickname
      })
    }
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
        price_per_day: this.state.perDay,
        price_total: this.state.orderTotal,
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
              numberOfCats: this.props.location.state.numberOfCats,
              checkInDate: this.props.location.state.checkInDate,
              checkOutDate: this.props.location.state.checkOutDate,
              nickname: this.props.location.state.nickname
            }
          })
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
            You are requesting a booking for <strong style={{ 'color': '#c90c61' }}>{this.state.numberOfCats} {this.state.numberOfCats > 1 ? 'cats' : 'cat'}</strong> with <strong style={{ 'color': '#c90c61' }}>{this.state.nickname}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{this.state.checkIn}</strong> until <strong style={{ 'color': '#c90c61' }}>{this.state.checkOut}</strong>.
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
            {this.state.orderTotal} kr
          </Header>
          <Header id='total' as='h5' style={{ 'marginTop': '0' }}>
            ({this.state.perDay} kr/day)
          </Header>
          {requestToBookButton}
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default connect(mapStateToProps)(RequestToBook)