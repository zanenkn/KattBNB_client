import React, { Component } from 'react'
import { Header, Form, Icon, Button, Message } from 'semantic-ui-react'
import Geocode from 'react-geocode'
import axios from 'axios'
import DayPicker, { DateUtils } from 'react-day-picker'
import '../../NpmPackageCSS/react-day-picker.css'
import { generateRandomNumber } from '../../Modules/locationRandomizer'
import { search } from '../../Modules/addressLocationMatcher'


class HostProfileForm extends Component {
  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.state = {
      selectedDays: [],
      description: '',
      userInputAddress: '',
      addressSearch: true,
      latitude: '',
      longitude: '',
      lat: '',
      long: '',
      address: '',
      rate: '',
      addressError: '',
      addressErrorDisplay: false,
      errors: '',
      onCreateErrorDisplay: false,
      maxCats: '',
      supplement: '',
      availability: '',
      loading: false
    }
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  convertAvailabilityDates() {
    let availableDates = this.state.selectedDays.map(function (day) {
      let date = new Date(day)
      let utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
      return new Date(utc).getTime()
    })
    let sortedAvailableDates = availableDates.sort(function (a, b) { return a - b })
    this.setState({
      availability: sortedAvailableDates
    })
  }

  handleDayClick(day, { selected }) {
    const { selectedDays } = this.state
    const today = new Date()
    const tomorrowNumber = today.getTime() + 86400000
    const tomorrowDate = new Date(tomorrowNumber)
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

  geolocationDataAddress = () => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE)
    Geocode.fromAddress(this.state.userInputAddress).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location
        if (search(this.props.location, response.results[0].address_components) === undefined) {
          if (window.confirm('It seems that the address you selected does not match your profile location. Are you sure you want to continue?')) {
            this.setState({
              latitude: lat,
              longitude: lng,
              lat: lat - generateRandomNumber(),
              long: lng + generateRandomNumber(),
              address: response.results[0].formatted_address,
              addressSearch: false,
              addressErrorDisplay: false
            })
          }
        } else {
          this.setState({
            latitude: lat,
            longitude: lng,
            lat: lat - generateRandomNumber(),
            long: lng + generateRandomNumber(),
            address: response.results[0].formatted_address,
            addressSearch: false,
            addressErrorDisplay: false
          })
        }
      },
      error => {
        this.setState({
          addressErrorDisplay: true,
          addressError: error.message
        })
      }
    )
  }

  listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      this.createHostProfile(event)
    }
  }

  listenEnterKeyAddress = (event) => {
    if (event.key === 'Enter') {
      this.geolocationDataAddress(event)
    }
  }

  createHostProfile = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.state.maxCats < 1 || this.state.rate < 0.01 || this.state.supplement < 0) {
      this.setState({
        loading: false,
        errors: ['Please check that all numeric fields are positive!'],
        onCreateErrorDisplay: true
      })
    } else {
      const path = '/api/v1/host_profiles'
      const payload = {
        description: this.state.description,
        full_address: this.state.address,
        price_per_day_1_cat: this.state.rate,
        supplement_price_per_cat_per_day: this.state.supplement,
        max_cats_accepted: this.state.maxCats,
        availability: this.state.availability,
        lat: this.state.lat,
        long: this.state.long,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        user_id: this.props.user_id
      }
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.post(path, payload, { headers: headers })
        .then(() => {
          this.setState({ onCreateErrorDisplay: false })
          window.alert('You have successfully created your host profile!')
          setTimeout(function () { window.location.replace('/user-page') }, 500)
        })
        .catch(error => {
          this.setState({
            loading: false,
            errors: error.response.data.error,
            onCreateErrorDisplay: true
          })
        })
    }
  }


  render() {
    let addressSearch, addressErrorMessage, onCreateErrorMessage, createHostProfileButton
    const today = new Date()
    const tomorrowNumber = today.getTime() + 86400000
    const tomorrowDate = new Date(tomorrowNumber)

    if (this.state.addressSearch === true) {
      addressSearch = (
        <Form.Input
          label='Your full address'
          placeholder='Search..'
          required
          id='userInputAddress'
          value={this.state.userInputAddress}
          onChange={this.onChangeHandler}
          onKeyPress={this.listenEnterKeyAddress}
          iconPosition='right'
          icon={<Icon id='search' name='search' link onClick={this.geolocationDataAddress.bind(this)} style={{ 'color': '#c90c61' }} />}
        />
      )
    } else {
      addressSearch = (
        <div className='required field'>
          <label for='userInputAddress'>
            Your full address
          </label>
          <p>
            {this.state.address}&nbsp;
            <Header as='strong' id='change-address-link' onClick={() => { this.setState({ addressSearch: true, address: '', lat: '', long: '', latitude: '', longitude: '' }) }} className='fake-link-underlined'>
              Not right?
            </Header>
          </p>
        </div>
      )
    }

    if (this.state.addressErrorDisplay) {
      addressErrorMessage = (
        <Message negative >
          {this.state.addressError}
        </Message>
      )
    }

    if (this.state.onCreateErrorDisplay) {
      onCreateErrorMessage = (
        <Message negative >
          <Message.Header>Host profile could not be saved because of following error(s):</Message.Header>
          <ul>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.loading) {
      createHostProfileButton = (
        <Button id='save-host-profile-button' className='submit-button' loading>
          Save
        </Button>
      )
    } else {
      createHostProfileButton = (
        <Button id='save-host-profile-button' className='submit-button' onClick={this.createHostProfile}>
          Save
        </Button>
      )
    }


    return (
      <div id='host-profile-form'>
        <Header as='h2'>
          Create host profile
        </Header>
        <p className='small-centered-paragraph' style={{ 'marginBottom': '1rem' }}>
          Fill in this information about yourself and start hosting cats today!
        </p>
        <Form id='host-profile-form'>
          <Form.TextArea
            label='About you'
            placeholder='Please write shortly about yourself and your experience with cats..'
            required
            id='description'
            value={this.state.description}
            onChange={this.onChangeHandler}
          />

          {addressErrorMessage}
          {addressSearch}
          <p className='small-left-paragraph'>
            Don’t worry, this will only be revealed to cat owners that have a confirmed booking with you!
          </p>

          <Form.Group
            widths='equal'
          >
            <Form.Input
              label='Your rate'
              type='number'
              placeholder='Your daily rate in kr/day'
              required
              id='rate'
              value={this.state.rate}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterKey}
            />

            <Form.Input
              label='Max cats accepted'
              type='number'
              placeholder='Max amount'
              required
              id='maxCats'
              value={this.state.maxCats}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterKey}
            />

            <Form.Input
              label='Supplement'
              type='number'
              placeholder='+35kr/cat/day'
              required
              id='supplement'
              value={this.state.supplement}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterKey}
            />
          </Form.Group>
          <p className='small-left-paragraph'>
            <strong>What does this mean?</strong> Let’s say that your rate is 120 kr/day for one cat and supplement for a second cat is 35 kr/day. That means if you host one cat for three days your payment is 120 x 3 =360 kr. Although if you agree to host two cats of the same owner for three days your payment is (120+35) x 3 = 465 kr
          </p>

          <div className='required field' >
            <label for='availability' >
              Availability
            </label>

            <DayPicker
              showWeekNumbers
              disabledDays={{ before: tomorrowDate }}
              firstDayOfWeek={1}
              selectedDays={this.state.selectedDays}
              onDayClick={this.handleDayClick}
            />
          </div>
          <p className='small-centered-paragraph'>
            Please mark the dates when you are available to host!
          </p>
        </Form>

        {onCreateErrorMessage}

        <div className='button-wrapper'>
          <div>
            <Button secondary className='cancel-button' onClick={this.props.closeForm}>Close</Button>
          </div>
          <div>
            {createHostProfileButton}
          </div>
        </div>

      </div>
    )
  }
}

export default HostProfileForm
