import React, { Component } from 'react'
import axios from 'axios'
import DayPicker, { DateUtils } from 'react-day-picker'
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
      incomingBookings: this.props.incomingBookings
    }
  }

  updateAvailability = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
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
      const payload = { availability: filteredAvailability }
      axios.patch(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false
          })
          window.alert('Your availability was succesfully updated!')
          window.location.reload()
        })
        .catch(error => {
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
        errors: ['There were no changes made in your availability!']
      })
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

  handleDayClick(day, { selected }) {
    const today = new Date()
    const tomorrowNumber = today.getTime() + 86400000
    const tomorrowDate = new Date(tomorrowNumber)
    const { selectedDays } = this.state
    if (day > tomorrowDate || day.toDateString() === tomorrowDate.toDateString()) {
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
    let errorDisplay, availabilityFormSubmitButton
    let disabledAvailabilityBookings = []
    let disabledAvailabilityDates = []
    let disabledDaysSorted = []
    let disabledDaysDates = []

    const today = new Date()
    let utc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    let todaysDate = new Date(utc).getTime()

    if (this.state.loading) {
      availabilityFormSubmitButton = (
        <Button loading id='availability-submit-button' className='submit-button'>Save</Button>
      )
    } else {
      availabilityFormSubmitButton = (
        <Button id='availability-submit-button' className='submit-button' onClick={this.updateAvailability}>Save</Button>
      )
    }

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
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

    return (
      <>
        <Divider />
        <p className='small-centered-paragraph'>
          You can update your availability below by marking the dates when you are willing to host.
        </p>
        <div style={{ 'marginRight': '-2rem', 'marginLeft': '-2rem', 'marginBottom': '-1rem' }}>
          <DayPicker
            showWeekNumbers
            firstDayOfWeek={1}
            selectedDays={this.state.selectedDays}
            fromMonth={today}
            disabledDays={disabledDaysDates}
            onDayClick={this.handleDayClick}
          />
        </div>
        {errorDisplay}
        <div className='button-wrapper'>
          <Button secondary id='availability-close-button' className='cancel-button' onClick={this.props.closeAllForms}>Close</Button>
          {availabilityFormSubmitButton}
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  }
}

export default AvailabilityUpdateForm
