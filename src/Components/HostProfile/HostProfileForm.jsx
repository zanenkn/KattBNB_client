import React, { Component } from 'react'
import { Header, Form, Button, Message } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next'
import Geocode from 'react-geocode'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import DayPicker, { DateUtils } from 'react-day-picker'
import '../../NpmPackageCSS/react-day-picker.css'
import MomentLocaleUtils from 'react-day-picker/moment'
import Spinner from '../ReusableComponents/Spinner'
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
    this.setState({ availability: sortedAvailableDates })
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
    const { t } = this.props
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE)
    Geocode.setLanguage('sv')
    Geocode.fromAddress(this.state.userInputAddress).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location
        if (search(this.props.location, response.results[0].address_components) === undefined) {
          if (window.confirm(t('reusable:alerts.no-match-address'))) {
            this.setState({
              latitude: lat,
              longitude: lng,
              lat: lat - generateRandomNumber(),
              long: lng + generateRandomNumber(),
              address: response.results[0].formatted_address,
              addressSearch: false,
              addressErrorDisplay: false,
              addressError: ''
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
            addressErrorDisplay: false,
            addressError: ''
          })
        }
      },
      error => {
        if (error.message === 'Server returned status code ZERO_RESULTS') {
          this.setState({
            addressErrorDisplay: true,
            addressError: t('reusable:errors:google-error-1')
          })
        } else if (error.message === 'Server returned status code REQUEST_DENIED') {
          this.setState({
            addressErrorDisplay: true,
            addressError: t('reusable:errors:google-error-2')
          })
        } else {
          this.setState({
            addressErrorDisplay: true,
            addressError: error.message
          })
        }
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
    const { t } = this.props
    const lang = detectLanguage()
    e.preventDefault()
    this.setState({ loading: true })
    if (window.navigator.onLine === false) {
      this.setState({
        loading: false,
        onCreateErrorDisplay: true,
        errors: ['reusable:errors:window-navigator']
      })
    } else {
      if (this.state.maxCats < 1 || this.state.rate < 0.01 || this.state.supplement < 0) {
        this.setState({
          loading: false,
          errors: ['HostProfileForm:create-error-1'],
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
          user_id: this.props.user_id,
          locale: lang
        }
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        axios.post(path, payload, { headers: headers })
          .then(() => {
            this.setState({ onCreateErrorDisplay: false })
            window.alert(t('HostProfileForm:create-success'))
            setTimeout(function () { window.location.replace('/user-page') }, 500)
          })
          .catch(error => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 500) {
              this.setState({
                loading: false,
                onCreateErrorDisplay: true,
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
                onCreateErrorDisplay: true,
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
      let addressSearch, addressErrorMessage, onCreateErrorMessage
      const today = new Date()
      const lang = detectLanguage()

      if (this.state.addressSearch === true) {
        addressSearch = (
          <div style={{ 'display': 'flex', 'alignItems': 'flex-end' }}>
            <Form.Input
              style={{ 'paddingRight': '1rem' }}
              label={t('HostProfileForm:address-label')}
              placeholder={t('HostProfileForm:address-search-plch')}
              required
              id='userInputAddress'
              value={this.state.userInputAddress}
              onChange={this.onChangeHandler}
              onBlur={this.state.userInputAddress !== '' && this.geolocationDataAddress.bind(this)}
              onKeyPress={this.listenEnterKeyAddress}
            />
            <div>
              <Button style={{ 'margin': '0 0 1em' }} id='search' onClick={this.geolocationDataAddress.bind(this)}>{t('reusable:cta:confirm')}</Button>
            </div>
          </div>
        )
      } else {
        addressSearch = (
          <div className='required field'>
            <label for='userInputAddress'>
              {t('HostProfileForm:address-label')}
            </label>
            <p>
              {this.state.address}&nbsp;
              <Header as='strong' id='change-address-link' onClick={() => { this.setState({ addressSearch: true, address: '', lat: '', long: '', latitude: '', longitude: '' }) }} className='fake-link-underlined'>
                {t('HostProfileForm:not-right')}
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
            <Message.Header>{t('HostProfileForm:create-error-2')}</Message.Header>
            <ul>
              {this.state.errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )
      }

      return (
        <div id='host-profile-form'>
          <Header as='h2' style={{ 'marginTop': '3rem' }}>
            {t('HostProfileForm:create-profile')}
          </Header>
          <p className='small-centered-paragraph' style={{ 'marginBottom': '1rem' }}>
            {t('HostProfileForm:create-profile-main-title')}
          </p>
          <Form id='host-profile-form'>
            <Form.TextArea
              label={t('HostProfileForm:about-you-label')}
              placeholder={t('HostProfileForm:about-you-plch')}
              required
              id='description'
              value={this.state.description}
              onChange={this.onChangeHandler}
            />
            {addressErrorMessage}
            {addressSearch}
            <p className='small-left-paragraph'>
              {t('HostProfileForm:address-message')}
            </p>
            <Form.Group
              widths='equal'
            >
              <Form.Input
                label={t('HostProfileForm:rate-label')}
                type='number'
                placeholder={t('HostProfileForm:rate-plch')}
                required
                id='rate'
                value={this.state.rate}
                onChange={this.onChangeHandler}
                onKeyPress={this.listenEnterKey}
              />
              <Form.Input
                label={t('HostProfileForm:max-cats-label')}
                type='number'
                placeholder={t('HostProfileForm:max-cats-plch')}
                required
                id='maxCats'
                value={this.state.maxCats}
                onChange={this.onChangeHandler}
                onKeyPress={this.listenEnterKey}
              />
              <Form.Input
                label={t('HostProfileForm:supplement-label')}
                type='number'
                placeholder={t('reusable:price.total-for-1')}
                required
                id='supplement'
                value={this.state.supplement}
                onChange={this.onChangeHandler}
                onKeyPress={this.listenEnterKey}
              />
            </Form.Group>
            <p className='small-left-paragraph'>
              <strong>{t('HostProfileForm:explain-supplement-1')}</strong> {t('reusable:explain-supplement')}
            </p>
            <div className='required field' >
              <label for='availability' >
                {t('HostProfileForm:availability-title')}
              </label>
              <DayPicker
                showWeekNumbers
                fromMonth={today}
                disabledDays={{ before: today }}
                firstDayOfWeek={1}
                selectedDays={this.state.selectedDays}
                onDayClick={this.handleDayClick}
                localeUtils={MomentLocaleUtils}
                locale={lang}
              />
            </div>
            <p className='small-centered-paragraph'>
              {t('HostProfileForm:availability-details')}
            </p>
          </Form>
          {onCreateErrorMessage}
          <div className='button-wrapper'>
            <div>
              <Button secondary className='cancel-button' onClick={this.props.closeForm}>{t('reusable:cta:close')}</Button>
            </div>
            <div>
              <Button id='save-host-profile-button' className='submit-button' disabled={this.state.loading} loading={this.state.loading} onClick={this.createHostProfile}>{t('reusable:cta:save')}</Button>
            </div>
          </div>
        </div>
      )
    } else { return <Spinner /> }
  }
}

export default withTranslation('HostProfileForm')(HostProfileForm)
