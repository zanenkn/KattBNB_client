import React, { Component } from 'react'
import axios from 'axios'
import Geocode from 'react-geocode'
import { Divider, Header, Form, Button, Message, Icon } from 'semantic-ui-react'
import { generateRandomNumber } from '../../Modules/locationRandomizer'
import { search } from '../../Modules/addressLocationMatcher'

class AddressUpdateForm extends Component {

  state = {
    errors: '',
    errorDisplay: false,
    loading: false,
    addressSearch: true,
    addressErrorDisplay: false,
    addressError: '',
    newAddress: '',
    lat: '',
    long: '',
    latitude: '',
    longitude: '',
    userInputAddress: this.props.fullAddress
  }

  updateAddress = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    const path = `/api/v1/host_profiles/${this.props.id}`
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    const payload = {
      full_address: this.state.newAddress,
      lat: this.state.lat,
      long: this.state.long,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }
    axios.patch(path, payload, { headers: headers })
      .then(() => {
        this.setState({
          loading: false,
          errorDisplay: false
        })
        window.alert('Your address was succesfully updated!')
        window.location.reload()
      })
      .catch(error => {
        this.setState({
          loading: false,
          errorDisplay: true,
          errors: error.response.data.errors.full_messages
        })
      })
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  listenEnterAddressSearch = (event) => {
    if (event.key === 'Enter') {
      this.geolocationDataAddress(event)
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
              newAddress: response.results[0].formatted_address,
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
            newAddress: response.results[0].formatted_address,
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

  render() {
    let addressFormSubmitButton, addressErrorMessage, addressSearch, errorDisplay

    if (this.state.loading) {
      addressFormSubmitButton = (
        <Button loading id='address-submit-button' className='submit-button'>Save</Button>
      )
    } else {
      if (this.props.fullAddress !== this.state.newAddress && this.state.newAddress !== '') {
        addressFormSubmitButton = (
          <Button id='address-submit-button' className='submit-button' onClick={this.updateAddress}>Save</Button>
        )
      } else {
        addressFormSubmitButton = (
          <Button disabled id='address-submit-button' className='submit-button'>Save</Button>
        )
      }
    }

    if (this.state.addressErrorDisplay) {
      addressErrorMessage = (
        <Message negative >
          {this.state.addressError}
        </Message>
      )
    }

    if (this.state.addressSearch === true) {
      addressSearch = (
        <>
          <Divider />
          <p className='small-centered-paragraph'>
            You can update your address below by entering and searching your new address.
          </p>
          {addressErrorMessage}
          <div style={{ 'margin': 'auto', 'display': 'table', 'width': '100%' }}>
            <Form.Input
              style={{ 'width': '100%' }}
              placeholder='Search...'
              required
              id='userInputAddress'
              value={this.state.userInputAddress}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterAddressSearch}
              iconPosition='right'
              icon={<Icon id='search' name='search' link onClick={this.geolocationDataAddress} style={{ 'color': '#c90c61' }} />}
            />
          </div>
          {errorDisplay}
          <div className='button-wrapper'>
            <Button secondary id='address-close-button' className='cancel-button' onClick={this.props.closeAllForms}>Close</Button>
            {addressFormSubmitButton}
          </div>
          <Divider style={{ 'marginBottom': '2rem' }} />
        </>
      )
    } else {
      addressSearch = (
        <>
          <Divider />
          <p className='small-centered-paragraph'>
            You can update your address below by entering and searching your new address.
          </p>
          <div className='required field'>
            <p style={{ 'textAlign': 'center' }}>
              {this.state.newAddress}&nbsp;
              <Header as='strong' id='change-address-link' onClick={() => { this.setState({ addressSearch: true, newAddress: '', lat: '', long: '', latitude: '', longitude: '' }) }} className='fake-link-underlined'>
                Not right?
              </Header>
            </p>
          </div>
          {errorDisplay}
          <div className='button-wrapper'>
            <Button secondary id='address-close-button' className='cancel-button' onClick={this.props.closeAllForms}>Close</Button>
            {addressFormSubmitButton}
          </div>
          <Divider style={{ 'marginBottom': '2rem' }} />
        </>
      )
    }

    return (
      <>
        {addressSearch}
      </>
    )
  }
}

export default AddressUpdateForm
