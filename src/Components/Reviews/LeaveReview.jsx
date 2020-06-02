import React, { useEffect } from 'react'
import { Header } from 'semantic-ui-react'
import { Trans, useTranslation } from 'react-i18next'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import ReviewScore from '../ReusableComponents/ReviewScore'


const LeaveReview = (props) => {

  const onScoreClick = () => {
    console.log("yo")
  }

  useEffect(() => {
    if (props.location.state === undefined || props.history.action === 'POP') {
      window.location.replace('/all-bookings')
    }
  }, [props.location.state, props.history.action])

  const createReview = (e) => {
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

  return (
    <div className='content-wrapper' >
      <Header as='h1'>
        Leave a review
      </Header>
      <ReviewScore setScore={() => onScoreClick()}/>
    </div>
  )
}

export default LeaveReview
