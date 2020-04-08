import React, { Component } from 'react'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import { withTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import DayPicker, { DateUtils } from 'react-day-picker'
import MomentLocaleUtils from 'react-day-picker/moment'
import '../../NpmPackageCSS/react-day-picker.css'
import { Divider, Button, Message } from 'semantic-ui-react'

class AvailabilityUpdateForm extends Component {

  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.state = {
      errorDisplay: false,
      errors: '',
      loading: false,
      newAvailability: this.props.availability,
      selectedDays: this.props.selectedDays,
      incomingBookings: this.props.incomingBookings,
      forbiddenDates: this.props.forbiddenDates
    }
  }

  updateAvailability = (e) => {
    e.preventDefault()
    const { t } = this.props
    const lang = detectLanguage()
    this.setState({ loading: true })
    if (window.navigator.onLine === false) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator']
      })
    } else {
      if (JSON.stringify(this.state.newAvailability) !== JSON.stringify(this.props.availability)) {
        const path = `/api/v1/host_profiles/${this.props.id}`
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        const filteredAvailability = this.state.newAvailability.filter(function (value) {
          let date = new Date()
          let utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
          return value > (new Date(utc)).getTime() - 86400000
        })
        const payload = {
          availability: filteredAvailability,
          locale: lang
        }
        axios.patch(path, payload, { headers: headers })
          .then(() => {
            this.setState({
              loading: false,
              errorDisplay: false,
              errors: ''
            })
            window.alert(t('AvailabilityUpdateForm:success-update'))
            window.location.reload()
          })
          .catch(error => {
            if (error.response.status === 500) {
              this.setState({
                loading: false,
                errorDisplay: true,
                errors: ['reusable:errors:500']
              })
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
      } else {
        this.setState({
          loading: false,
          errorDisplay: true,
          errors: ['AvailabilityUpdateForm:update-error']
        })
      }
    }
  }

  convertAvailabilityDates() {
    let availableDates = this.state.selectedDays.map(function (day) {
      let date = new Date(day)
      let utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
      return new Date(utc).getTime()
    })
    let sortedAvailableDates = availableDates.sort(function (a, b) { return a - b })
    this.setState({ newAvailability: sortedAvailableDates })
  }

  handleDayClick(day, { selected, disabled }) {
    const today = new Date()
    const tomorrowNumber = today.getTime() + 86400000
    const tomorrowDate = new Date(tomorrowNumber)
    const { selectedDays } = this.state
    if (day > tomorrowDate || day.toDateString() === tomorrowDate.toDateString()) {
      if (disabled) {
        return
      }
      if (selected) {
        const selectedIndex = selectedDays.findIndex(selectedDay =>
          DateUtils.isSameDay(selectedDay, day)
        )
        selectedDays.splice(selectedIndex, 1)
      } else {
        selectedDays.push(day)
      }
      this.setState({ selectedDays })
      this.convertAvailabilityDates()
    }
  }

  render() {
    const { t } = this.props

    if (this.props.tReady) {
      let errorDisplay
      const lang = detectLanguage()
      let disabledAvailabilityBookings = []
      let disabledAvailabilityDates = []
      let disabledDaysSorted = []

      const today = new Date()
      let utc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
      let todaysDate = new Date(utc).getTime()

      let disabledDaysDates = [{ before: today }]

      if (this.state.errorDisplay) {
        errorDisplay = (
          <Message negative >
            <Message.Header style={{ 'textAlign': 'center' }} >{t('reusable:errors:action-error-header')}</Message.Header>
            <ul id='message-error-list'>
              {this.state.errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )
      }

      if (this.state.incomingBookings.length > 0) {
        this.state.incomingBookings.map(booking => {
          if (booking.status === 'pending' || (booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > todaysDate)) {
            disabledAvailabilityBookings.push(booking.dates)
          }
          disabledAvailabilityDates = disabledAvailabilityBookings.flat()
          disabledDaysSorted = disabledAvailabilityDates.sort()
        })
        disabledDaysSorted.map(day => {
          disabledDaysDates.push(new Date(day))
        })
      }

      if (this.state.forbiddenDates.length > 0) {
        this.state.forbiddenDates.map(date => {
          disabledDaysDates.push(new Date(date))
        })
      }

      return (
        <>
          <Divider />
          <p className='small-centered-paragraph'>
            {t('AvailabilityUpdateForm:main-title')}
          </p>
          <div style={{ 'marginRight': '-2rem', 'marginLeft': '-2rem', 'marginBottom': '-1rem' }}>
            <DayPicker
              showWeekNumbers
              firstDayOfWeek={1}
              selectedDays={this.state.selectedDays}
              fromMonth={today}
              disabledDays={disabledDaysDates}
              onDayClick={this.handleDayClick}
              localeUtils={MomentLocaleUtils}
              locale={lang}
            />
          </div>
          {errorDisplay}
          <div className='button-wrapper'>
            <Button secondary id='availability-close-button' className='cancel-button' onClick={this.props.closeAllForms}>{t('reusable:cta:close')}</Button>
            <Button id='availability-submit-button' className='submit-button' disabled={this.state.loading} loading={this.state.loading} onClick={this.updateAvailability}>{t('reusable:cta:save')}</Button>
          </div>
          <Divider style={{ 'marginBottom': '2rem' }} />
        </>
      )
    } else { return <Spinner /> }
  }
}

export default withTranslation('AvailabilityUpdateForm')(AvailabilityUpdateForm)
