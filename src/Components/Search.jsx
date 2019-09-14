import React, { Component } from 'react'
import { Header, Form, Button, Dropdown, Message } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../Modules/locationData'
import DatePicker from 'react-datepicker'
import '../react-datepicker.css'
import axios from 'axios'


class Search extends Component {
  state = {
    errorDisplay: false,
    errors: '',
    loading: false,
    startDate: null,
    endDate: null,
    location: '',
    cats: ''
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleLocationChange = (e, { value }) => {
    this.setState({ location: value })
  }

  handleStartDateChange = date => {
    this.setState({
      startDate: date
    })
  }

  handleEndDateChange = date => {
    this.setState({
      endDate: date
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
    if (this.state.cats <= 0 || this.state.cats % 1 != 0) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['Number of cats must be a whole positive number!']
      })
    }
    axios.get(`/api/v1/host_profiles?user_id=${this.props.id}`).then(response => {
      this.setState({ hostProfile: response.data })
    })
  }


  render() {

    let checkOutCalendar
    let errorDisplay

    if (this.state.startDate === null) {
      checkOutCalendar = (
        <DatePicker
          isClearable
          withPortal
          showWeekNumbers
          disabled
          dateFormat='yyyy/MM/dd'
          placeholderText='Check-out'
          selected={this.state.endDate}
          onChange={this.handleEndDateChange}
        />
      )
    } else {
      checkOutCalendar = (
        <DatePicker
          isClearable
          withPortal
          showWeekNumbers
          dateFormat='yyyy/MM/dd'
          placeholderText='Check-out'
          minDate={this.state.startDate.getTime() + 86400000}
          selected={this.state.endDate}
          onChange={this.handleEndDateChange}
        />
      )
    }

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


    return (
      <div className='content-wrapper' >
        <div id='search-form'>
          <Header as='h2'>
            Find a cat sitter!
          </Header>
          <p className='small-centered-paragraph' style={{ 'marginBottom': '1rem' }}>
            Fill in the information below and find the appropriate person to take care of your cat while you're away!
          </p>
          <Form id='search-form'>
            <div className='required field' >
              <label>
                Where
              </label>
            </div>
            <Dropdown
              clearable
              search
              selection
              placeholder='Choose your location'
              options={LOCATION_OPTIONS}
              id='location'
              style={{ 'maxWidth': '194px' }}
              onChange={this.handleLocationChange}
              onKeyPress={this.listenEnterKeySearch}
            />
            <br />
            <br />
            <div className='required field' >
              <label>
                When
              </label>
            </div>
            <Form.Group
              widths='equal'
            >
              <DatePicker
                isClearable
                withPortal
                showWeekNumbers
                dateFormat='yyyy/MM/dd'
                placeholderText='Check-in'
                minDate={new Date().getTime() + 86400000}
                selected={this.state.startDate}
                onChange={this.handleStartDateChange}
              />
              {checkOutCalendar}
            </Form.Group>
            <br />
            <Form.Input
              label='Number of cats'
              type='number'
              required
              id='cats'
              value={this.state.cats}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterKeySearch}
              style={{ 'maxWidth': '194px' }}
            />
          </Form>
          {errorDisplay}
          <div className='button-wrapper'>
            <div>
              <Button className='submit-button' onClick={this.search}>Search</Button>
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Search
