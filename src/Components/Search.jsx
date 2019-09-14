import React, { Component } from 'react'
import { Header, Form, Button, Dropdown } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../Modules/locationData'
import DatePicker from 'react-datepicker'
import '../react-datepicker.css'


class Search extends Component {
  state = {
    startDate: new Date(),
    endDate: new Date(),
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


  render() {


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
                selected={this.state.startDate}
                onChange={this.handleStartDateChange}
              />
              <DatePicker
                selected={this.state.endDate}
                onChange={this.handleEndDateChange}
              />
            </Form.Group>
            <br />
            <Form.Input
              label='Number of cats'
              type='number'
              required
              id='cats'
              value={this.state.cats}
              onChange={this.onChangeHandler}
              style={{ 'maxWidth': '194px' }}
            />
          </Form>
          <div className='button-wrapper'>
            <div>
              <Button secondary className='cancel-button' >Close</Button>
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
