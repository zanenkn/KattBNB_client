import React, { useState } from 'react'
import axios from 'axios'
import Geocode from 'react-geocode'
import { Divider, Header, Form, Button, Message, Icon } from 'semantic-ui-react'
import { generateRandomNumber } from '../../Modules/locationRandomizer'
import { search } from '../../Modules/addressLocationMatcher'

const AddressUpdateForm = (props) => {
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [addressSearch, setAddressSearch] = useState(true)
  const [addressErrorDisplay, setAddressErrorDisplay] = useState(false)
  const [addressError, setAddressError] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [lat, setLat] = useState('')
  const [long, setLong] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [userInputAddress, setUserInputAddress] = useState(props.fullAddress)

  const updateAddress = () => {
    setLoading(true)
    const path = `/api/v1/host_profiles/${props.id}`
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    const payload = {
      full_address: newAddress,
      lat: lat,
      long: long,
      latitude: latitude,
      longitude: longitude
    }
    axios.patch(path, payload, { headers: headers })
      .then(() => {
        window.alert('Your address was succesfully updated!')
        props.setElement('fullAddress', newAddress)
        props.closeAllForms()
      })
      .catch(error => {
        setLoading(false)
        setErrorDisplay(true)
        setErrors([error.response.data.errors.full_messages])
      })
  }

  const geolocationDataAddress = () => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE)
    Geocode.fromAddress(userInputAddress).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location
        if (search(props.location, response.results[0].address_components) === undefined) {
          if (window.confirm('It seems that the address you selected does not match your profile location. Are you sure you want to continue?')) {
            setLatitude(lat)
            setLongitude(lng)
            setLat(lat - generateRandomNumber())
            setLong(lng + generateRandomNumber())
            setNewAddress(response.results[0].formatted_address)
            setAddressSearch(false)
            setAddressErrorDisplay(false)
          }
        } else {
          setLatitude(lat)
          setLongitude(lng)
          setLat(lat - generateRandomNumber())
          setLong(lng + generateRandomNumber())
          setNewAddress(response.results[0].formatted_address)
          setAddressSearch(false)
          setAddressErrorDisplay(false)
        }
      },
      error => {
        setAddressErrorDisplay(true)
        setAddressError(error.message)
      }
    )
  }

  const backToSearch = () => {
    setAddressSearch(true)
    setNewAddress('')
    setLat('')
    setLong('')
    setLatitude('')
    setLongitude('')
  }

  return (
    <>
      <Divider />
      <p className='small-centered-paragraph'>
        You can update your address below by entering and searching your new address.
      </p>
      {addressErrorDisplay &&
        <Message negative >
          {addressError}
        </Message>
      }
      {addressSearch ?
        <div style={{ 'margin': 'auto', 'display': 'table', 'width': '100%' }}>
          <Form.Input
            style={{ 'width': '100%' }}
            placeholder='Search...'
            required
            id='userInputAddress'
            value={userInputAddress}
            onChange={e => setUserInputAddress(e.target.value)}
            onKeyPress={e => { e.key === 'Enter' && updateAddress() }}
            iconPosition='right'
            icon={<Icon id='search' name='search' link onClick={() => geolocationDataAddress()} style={{ 'color': '#c90c61' }} />}
          />
        </div>
        :
        <div className='required field'>
          <p style={{ 'textAlign': 'center' }}>
            {newAddress}&nbsp;
              <Header as='strong' id='change-address-link' onClick={() => backToSearch()} className='fake-link-underlined'>
              Not right?
              </Header>
          </p>
        </div>
      }
      {errorDisplay &&
        <Message negative >
          <Message.Header style={{ 'textAlign': 'center' }} >Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      }
      <div className='button-wrapper'>
        <Button secondary id='address-close-button' className='cancel-button' onClick={() => props.closeAllForms()}>Close</Button>
        <Button loading={loading} disabled={props.fullAddress !== newAddress && newAddress !== '' ? false : true} id='address-submit-button' className='submit-button' onClick={() => updateAddress()}>Save</Button>
      </div>
      <Divider style={{ 'marginBottom': '2rem' }} />
    </>
  )
}

export default AddressUpdateForm
