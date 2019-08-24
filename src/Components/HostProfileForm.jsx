import React, { Component } from 'react'
import { Header, Form, Icon, Button, Message } from 'semantic-ui-react'
import Geocode from 'react-geocode'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'


class HostProfileForm extends Component {
  state = {
    description: '',
    user_input_address: '',
    address_search: true,
    latitude: '',
    longitude: '',
    lat: '',
    long: '',
    address: '',
    rate: '',
    addressError: '',
    addressErrorDisplay: false,
    maxCats: '',
    supplement: '',
    startDate: new Date()
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleDateChange(date) {
    this.setState({
      startDate: date
    })
  }

  geolocationDataAddress = () => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE)
    Geocode.fromAddress(this.state.user_input_address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({
          latitude: lat,
          longitude: lng,
          lat: lat + 0.001,
          long: lng + 0.001,
          address: response.results[0].formatted_address,
          address_search: false,
          addressErrorDisplay: false
        })
      },
      error => {
        this.setState({
          addressErrorDisplay: true,
          addressError: error.message
        })
      }
    )
  }

  render() {
    let addressSearch
    let addressErrorMessage

    if (this.state.address_search === true) {
      addressSearch = (
        <>
          <Form.Group unstackable>
            <Form.Input
              width={12}
              label='Your full address'
              placeholder='Search..'
              required
              id='user_input_address'
              value={this.state.user_input_address}
              onChange={this.onChangeHandler}
            />

            <Button width={4} onClick={this.geolocationDataAddress.bind(this)} style={{ 'margin-top': '1.7rem', 'padding-left': '1rem', 'padding-right': '1rem' }}>
              <Icon
                name='search'
              />
            </Button>
          </Form.Group>
        </>
      )
    } else {
      addressSearch = (
        <div className="change-address-link">
          <p>{this.state.address}</p>
          <p className='address-change' onClick={() => { this.setState({ address_search: true }) }}>
            Change
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

    return (
      <div id='host-profile-form'>
        <Header as='h2'>
          Create host profile
        </Header>
        <p className='small-centered-paragraph'>
          Fill in this information about yourself and start hosting cats today!
        </p>
        <Form id='login-form'>
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
          <Form.Input
            label='Your rate'
            type='number'
            placeholder='Your daily rate in kr/day'
            required
            id='rate'
            value={this.state.rate}
            onChange={this.onChangeHandler}
          />
          <Form.Group
            widths='equal'
          >
            <Form.Input
              label='Max cats accepted'
              type='number'
              placeholder='Max amount'
              required
              id='maxCats'
              value={this.state.maxCats}
              onChange={this.onChangeHandler}
            />

            <Form.Input
              label='Supplement'
              type='number'
              placeholder='+35kr/cat/day'
              required
              id='supplement'
              value={this.state.supplement}
              onChange={this.onChangeHandler}
            />
          </Form.Group>
        </Form>


        <DatePicker
          dateFormat='yyyy/MM/dd'
          todayButton={'Today'}
          minDate={new Date()}
   //       includeDates={[1567123200000, 1567209600000]}
          selected={this.state.startDate}
          onChange={this.handleDateChange.bind(this)}
        />



      </div>
    )
  }
}

export default HostProfileForm
