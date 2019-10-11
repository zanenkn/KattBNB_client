import React, { Component } from 'react'
import { Header, Form, Button, Dropdown, Message, Segment } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../Modules/locationData'
import axios from 'axios'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import '../react-day-picker-range.css'
import { formatDate, parseDate } from 'react-day-picker/moment'


class Search extends Component {
  constructor(props) {
    super(props)
    this.handleFromChange = this.handleFromChange.bind(this)
    this.handleToChange = this.handleToChange.bind(this)
    this.state = {
      errorDisplay: false,
      errors: '',
      searchData: '',
      loading: false,
      location: '',
      cats: '',
      from: undefined,
      to: undefined
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleLocationChange = (e, { value }) => {
    this.setState({ location: value })
  }

  showFromMonth() {
    const { from, to } = this.state
    if (!from) {
      return
    }
    if (moment(to).diff(moment(from), 'months') < 2) {
      this.to.getDayPicker().showMonth(from)
    }
  }

  async handleFromChange(from) {
    await this.setState({ from })
    this.to.getInput().focus()
  }

  handleToChange(to) {
    this.setState({ to }, this.showFromMonth)
  }

  async searchAxiosCall() {
    await axios.get(`/api/v1/host_profiles?location=${this.state.location}`).then(response => {
      this.setState({
        searchData: response.data,
        loading: false,
        errors: '',
        errorDisplay: false
      })
    })
    let utcFrom = Date.UTC(this.state.from.getUTCFullYear(), this.state.from.getUTCMonth(), this.state.from.getUTCDate())
    let msFrom = new Date(utcFrom).getTime()
    let utcTo = Date.UTC(this.state.to.getUTCFullYear(), this.state.to.getUTCMonth(), this.state.to.getUTCDate())
    let msTo = new Date(utcTo).getTime()
    this.props.history.push({
      pathname: '/search-results',
      state: {
        from: msFrom,
        to: msTo,
        cats: this.state.cats,
        location: this.state.location,
        searchData: this.state.searchData
      }
    })
  }

  clearDates = () => {
    this.setState({
      from: undefined,
      to: undefined,
      errorDisplay: false,
      errors: ''
    })
  }

  listenEnterKeySearch = (event) => {
    if (event.key === 'Enter') {
      this.search(event)
    }
  }

  search = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    if (this.state.cats <= 0 || this.state.cats % 1 !== 0) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['Number of cats must be a whole positive number!']
      })
    } else if (this.state.location === '') {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['You must choose a location to continue!']
      })
    } else if (this.state.to === undefined || this.state.from === undefined) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['You must choose both check-in and check-out dates to continue!']
      })
    } else {
      this.searchAxiosCall()
    }
  }


  render() {

    let errorDisplay
    let searchButton

    const { from, to } = this.state
    const modifiers = { start: from, end: to }
    const today = new Date()
    const tomorrowNumber = today.getTime() + 86400000
    const tomorrowDate = new Date(tomorrowNumber)

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header>Search could not be performed because of following error(s):</Message.Header>
          <ul>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.loading) {
      searchButton = (
        <Button className='submit-button' loading>Search</Button>
      )
    } else {
      searchButton = (
        <Button id='search-button' className='submit-button' onClick={this.search}>Search</Button>
      )
    }

    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          Find a cat sitter!
        </Header>
        <Segment className='whitebox'>
          <Form id='search-form' style={{ 'margin': 'auto', 'maxWidth': '177px' }}>

            <div className='required field' style={{ 'marginBottom': '0.5em' }}>
              <label>
                When
                </label>
              <div className='InputFromTo'>
                <DayPickerInput
                  value={from}
                  placeholder='Check-in'
                  format='LL'
                  formatDate={formatDate}
                  parseDate={parseDate}
                  inputProps={{ readOnly: true }}
                  dayPickerProps={{
                    selectedDays: [from, { from, to }],
                    disabledDays: { after: to, before: tomorrowDate },
                    toMonth: to,
                    modifiers,
                    numberOfMonths: 1,
                    firstDayOfWeek: 1,
                    showWeekNumbers: true
                  }}
                  onDayChange={this.handleFromChange}
                />
              </div>
              <div className='InputFromTo' style={{ 'marginTop': '0.5em' }}>
                <DayPickerInput
                  ref={el => (this.to = el)}
                  value={to}
                  placeholder='Check-out'
                  format='LL'
                  formatDate={formatDate}
                  parseDate={parseDate}
                  inputProps={this.state.from === undefined ? { disabled: true } : { disabled: false, readOnly: true }}
                  dayPickerProps={{
                    selectedDays: [from, { from, to }],
                    disabledDays: this.state.from !== undefined ? { before: from } : { before: tomorrowDate },
                    modifiers,
                    firstDayOfWeek: 1,
                    showWeekNumbers: true,
                    month: from,
                    fromMonth: from,
                    numberOfMonths: 1
                  }}
                  onDayChange={this.handleToChange}
                />
              </div>
            </div>
            <div style={(this.state.from === undefined && this.state.to === undefined) ? { 'visibility': 'hidden' } : {}}>
              <Header className='fake-link-underlined' style={{ 'textAlign': 'right' }} onClick={this.clearDates}> Clear dates </Header>
            </div>

            <div className='required field' style={{ 'marginBottom': '1.5em' }}>
              <label>
                Where
              </label>
              <Dropdown
                style={{ 'minWidth': '-webkit-fill-available' }}
                clearable
                search
                selection
                placeholder='Choose your location'
                options={LOCATION_OPTIONS}
                id='location'
                onChange={this.handleLocationChange}
                onKeyPress={this.listenEnterKeySearch}
              />
            </div>

            <Form.Input
              label='For how many cats'
              type='number'
              required
              id='cats'
              value={this.state.cats}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterKeySearch}
              style={{ 'maxWidth': '180px', 'height': '38px' }}
            />
          </Form>
          {errorDisplay}
          <div className='button-wrapper'>
            <div>
              {searchButton}
            </div>
          </div>
        </Segment>
      </div>
    )
  }
}

export default Search
