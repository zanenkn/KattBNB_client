import React, { Component } from 'react'
import { Header, Form, Button, Dropdown, Message, Segment } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../Modules/locationData'
import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import '../NpmPackageCSS/react-day-picker-range.css'
import { formatDate, parseDate } from 'react-day-picker/moment'
import { withTranslation } from 'react-i18next'

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
      location: this.props.location,
      cats: '',
      from: undefined,
      to: undefined
    }
  }

  componentDidMount() {
    if (this.props.history.location.state !== undefined) {
      this.setState({
        from: this.props.history.location.state.checkInDate,
        to: this.props.history.location.state.checkOutDate,
        location: this.props.history.location.state.location,
        cats: this.props.history.location.state.numberOfCats
      })
    }
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
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
        errors: ['Search:error-1']
      })
    } else if (this.state.location === '' || this.state.location === undefined) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['Search:error-2']
      })
    } else if (this.state.to === undefined || this.state.from === undefined) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['Search:error-3']
      })
    } else {
      this.searchAxiosCall()
    }
  }


  render() {
    const { t } = this.props
    let errorDisplay

    const { from, to } = this.state
    const modifiers = { start: from, end: to }
    const today = new Date()

    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header>{t('Search:error-header')}</Message.Header>
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
          {t('Search:title')}
        </Header>
        <Segment className='whitebox'>
          <Form id='search-form' style={{ 'margin': 'auto', 'maxWidth': '177px' }}>
            <div className='required field' style={{ 'marginBottom': '0.5em' }}>
              <label>
                {t('Search:when')}
                </label>
              <div className='InputFromTo'>
                <DayPickerInput
                  value={from}
                  placeholder={t('Search:checkin')}
                  format='LL'
                  formatDate={formatDate}
                  parseDate={parseDate}
                  inputProps={{ readOnly: true }}
                  dayPickerProps={{
                    selectedDays: [from, { from, to }],
                    disabledDays: { after: to, before: today },
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
                  placeholder={t('Search:checkout')}
                  format='LL'
                  formatDate={formatDate}
                  parseDate={parseDate}
                  inputProps={this.state.from === undefined ? { disabled: true } : { disabled: false, readOnly: true }}
                  dayPickerProps={{
                    selectedDays: [from, { from, to }],
                    disabledDays: this.state.from !== undefined ? { before: from } : { before: today },
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
              <Header className='fake-link-underlined' style={{ 'textAlign': 'right' }} onClick={this.clearDates}> {t('Search:reset')} </Header>
            </div>
            <div className='required field' style={{ 'marginBottom': '1.5em' }}>
              <label>
                {t('Search:where')}
              </label>
              <Dropdown
                clearable
                search
                selection
                value={this.state.location}
                placeholder={t('Search:where-plch')}
                options={LOCATION_OPTIONS}
                id='location'
                onChange={this.handleLocationChange}
                onKeyPress={this.listenEnterKeySearch}
              />
            </div>
            <Form.Input
              label={t('Search:how-many')}
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
              <Button id='search-button' className='submit-button' loading={this.state.loading ? true : false} onClick={this.search}>{t('Search:cta')}</Button>
            </div>
          </div>
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = state => ({ location: state.reduxTokenAuth.currentUser.attributes.location })

export default withTranslation(connect(mapStateToProps)(Search))
