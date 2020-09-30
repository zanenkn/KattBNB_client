import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Form, Button, Message, Segment } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import moment from 'moment'
import axios from 'axios'
import StripeCardDetails from './StripeCardDetails'
import { ElementsConsumer, CardElement } from '@stripe/react-stripe-js'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
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
    nickname: '',
    paymentIntent: '',
    cardholderName: ''
  }

  createPaymentIntent = async () => {
    const { t } = this.props
    if (window.navigator.onLine === false) {
      this.setState({
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator']
      })
    } else {
      try {
        const lang = detectLanguage()
        const amount = total(this.props.location.state.hostRate, this.props.location.state.numberOfCats, this.props.location.state.hostSupplement, this.props.location.state.checkInDate, this.props.location.state.checkOutDate)
        const path = `/api/v1/stripe?locale=${lang}&occasion=create_payment_intent&amount=${amount}&currency=sek`
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        const response = await axios.get(path, { headers: headers })
        this.setState({ paymentIntent: response.data.intent_id })
      } catch (error) {
        if (error.response === undefined) {
          wipeCredentials('/is-not-available?atm')
        } else if (error.response.status === 503) {
          wipeCredentials('/is-not-available?atm')
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors:401'))
          wipeCredentials('/')
        } else {
          this.setState({
            errorDisplay: true,
            errors: [error.response.data.error]
          })
        }
      }
    }
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
      this.createPaymentIntent()
    }
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  createBookingAndPay = async (event, stripe, elements) => {
    event.preventDefault()
    this.setState({
      loading: true,
      errorDisplay: false,
      errors: ''
    })
    if (window.navigator.onLine === false) {
      this.setState({
        loading: false,
        errors: ['reusable:errors:window-navigator'],
        errorDisplay: true
      })
    } else {
      if (!stripe || !elements) {
        this.setState({
          loading: false,
          errorDisplay: true,
          errors: ['Our payments provider is temporarily unavailable. Try again later.']
        })
        return
      }
      const result = await stripe.confirmCardPayment(this.state.paymentIntent, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: this.state.cardholderName,
          }
        }
      })
      if (result.error) {
        this.setState({
          loading: false,
          errors: [result.error.message],
          errorDisplay: true
        })
      } else {
        console.log('yes!!!!')
        // The payment has been processed!
        if (result.paymentIntent.status === 'requires_capture') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.
          console.log('success')
        }
      }
    }
  }

  createBooking = (e) => {
    e.preventDefault()
    const { t } = this.props
    const lang = detectLanguage()
    this.setState({ loading: true })
    if (window.navigator.onLine === false) {
      this.setState({
        loading: false,
        errors: ['reusable:errors:window-navigator'],
        errorDisplay: true
      })
    } else {
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
          user_id: this.props.id,
          locale: lang
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
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 500) {
              this.setState({
                loading: false,
                errorDisplay: true,
                errors: ['reusable:errors:500']
              })
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'))
              wipeCredentials('/')
            } else {
              this.setState({
                loading: false,
                errorDisplay: true,
                errors: error.response.data.error
              })
            }
          })
      }
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
              <Trans i18nKey='RequestToBook:agree-to-pay-directly'>
                By requesting to book, you agree to pay the following total cost to <strong style={{ 'color': '#c90c61' }}>{{ host: this.state.nickname }}</strong> directly:
              </Trans>
            </p>
            <Header id='total' as='h3' style={{ 'marginTop': '0', 'marginBottom': '0' }}>
              {this.state.orderTotal} kr
            </Header>
            <Header id='total' as='h5' style={{ 'marginTop': '0' }}>
              ({this.state.perDay} {t('reusable:price.per-day')})
            </Header>
            <Form.Input
              type='text'
              placeholder='cardholder name'
              required
              id='cardholderName'
              value={this.state.cardholderName}
              onChange={this.onChangeHandler}
            />
            <ElementsConsumer>
              {({ stripe, elements }) => (
                <>
                  <StripeCardDetails
                    stripe={stripe}
                    elements={elements}
                  />
                  <Button onClick={(e) => this.createBookingAndPay(e, stripe, elements)} id='request-to-book-button' className='submit-button' style={{ 'marginTop': '0' }} disabled={this.state.loading} loading={this.state.loading}>
                    {t('reusable:request-cta.btn')}
                  </Button>
                </>)}
            </ElementsConsumer>
          </Segment>
        </div>
      )
    } else { return <Spinner /> }
  }
}

const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default withTranslation('RequestToBook')(connect(mapStateToProps)(RequestToBook))
