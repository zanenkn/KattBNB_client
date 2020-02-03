import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Form, Button, Message, Segment } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import moment from 'moment'
import axios from 'axios'
import { pricePerDay, total } from '../../Modules/PriceCalculations'
import { Trans, withTranslation } from 'react-i18next'

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
        errors: ['RequestToBook:error-1'],
        errorDisplay: true
      })
    } else if (this.state.message.length > 400) {
      this.setState({
        loading: false,
        errors: ['RequestToBook:error-2'],
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
    const { t } = this.props

    if (this.props.tReady) {
      let errorDisplay, messageLength

      messageLength = 400 - this.state.message.length

      if (this.state.errorDisplay) {
        errorDisplay = (
          <Message negative >
            <Message.Header>{t('RequestToBook:error-header')}</Message.Header>
            <ul>
              {this.state.errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )
      }

      return (
        <div className='content-wrapper' >
          <Header as='h1'>
            {t('RequestToBook:title')}
          </Header>
          <Segment className='whitebox'>
            <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
              <Trans i18nKey='RequestToBook:request-info' count={parseInt(this.state.numberOfCats)}>
                You are requesting a booking for <strong style={{ 'color': '#c90c61' }}>{{ count: this.state.numberOfCats }} cat</strong> with <strong style={{ 'color': '#c90c61' }}>{{ host: this.state.nickname }}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{{ checkin: this.state.checkIn }}</strong> until <strong style={{ 'color': '#c90c61' }}>{{ checkout: this.state.checkOut }}</strong>.
              </Trans>
            </p>
            <Form>
              <Form.TextArea
                label={t('reusable:plch.message')}
                placeholder={t('RequestToBook:message-plch')}
                required
                id='message'
                value={this.state.message}
                onChange={this.onChangeHandler}
              />
            </Form>
            <p style={{ 'textAlign': 'end', 'fontSize': 'smaller', 'fontStyle': 'italic' }}>
              {t('reusable:remaining-chars')} {messageLength}
            </p>
            {errorDisplay}
            <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
              {t('RequestToBook:agree-to-pay')}
            </p>
            <Header id='total' as='h3' style={{ 'marginTop': '0', 'marginBottom': '0' }}>
              {this.state.orderTotal} kr
            </Header>
            <Header id='total' as='h5' style={{ 'marginTop': '0' }}>
              ({this.state.perDay} {t('reusable:price.per-day')})
            </Header>
            <Button id='request-to-book-button' className='submit-button' style={{ 'marginTop': '0' }} loading={this.state.loading ? true : false} onClick={this.createBooking}>
              {t('reusable:request-cta.btn')}
            </Button>
          </Segment>
        </div>
      )
    } else { return <Spinner /> }
  }
}

const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default withTranslation('RequestToBook')(connect(mapStateToProps)(RequestToBook))
