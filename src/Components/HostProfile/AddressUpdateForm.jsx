import React, { useState } from 'react'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import { useTranslation } from 'react-i18next'
import Geocode from 'react-geocode'
import { Divider, Header, Form, Button, Message, Icon } from 'semantic-ui-react'
import { generateRandomNumber } from '../../Modules/locationRandomizer'
import { search } from '../../Modules/addressLocationMatcher'
import Spinner from '../ReusableComponents/Spinner'

const AddressUpdateForm = (props) => {

  const { t, ready } = useTranslation('AddressUpdateForm')

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
    const lang = detectLanguage()
    setLoading(true)
    if (window.navigator.onLine === false) {
      setLoading(false)
      setErrorDisplay(true)
      setErrors(['reusable:errors:window-navigator'])
    } else {
      if (props.fullAddress === newAddress || newAddress === '') {
        setLoading(false)
        setErrorDisplay(true)
        setErrors(['AddressUpdateForm:update-error'])
      } else {
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
          longitude: longitude,
          locale: lang
        }
        axios.patch(path, payload, { headers: headers })
          .then(() => {
            window.alert(t('AddressUpdateForm:update-success'))
            props.setElement('fullAddress', newAddress)
            props.closeAllForms()
            setErrorDisplay(false)
            setErrors([])
          })
          .catch(error => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 500) {
              setLoading(false)
              setErrorDisplay(true)
              setErrors(['reusable:errors:500'])
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'))
              wipeCredentials('/')
            } else {
              setLoading(false)
              setErrorDisplay(true)
              setErrors([error.response.data.error])
            }
          })
      }
    }
  }

  const geolocationDataAddress = () => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE)
    Geocode.fromAddress(userInputAddress).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location
        if (search(props.location, response.results[0].address_components) === undefined) {
          if (window.confirm(t('reusable:alerts.no-match-address'))) {
            setLatitude(lat)
            setLongitude(lng)
            setLat(lat - generateRandomNumber())
            setLong(lng + generateRandomNumber())
            setNewAddress(response.results[0].formatted_address)
            setAddressSearch(false)
            setAddressErrorDisplay(false)
            setErrorDisplay(false)
            setErrors([])
          }
        } else {
          setLatitude(lat)
          setLongitude(lng)
          setLat(lat - generateRandomNumber())
          setLong(lng + generateRandomNumber())
          setNewAddress(response.results[0].formatted_address)
          setAddressSearch(false)
          setAddressErrorDisplay(false)
          setErrorDisplay(false)
          setErrors([])
        }
      },
      error => {
        if (error.message === 'Server returned status code ZERO_RESULTS') {
          setAddressErrorDisplay(true)
          setAddressError(t('reusable:errors:google-error-1'))
        } else if (error.message === 'Server returned status code REQUEST_DENIED') {
          setAddressErrorDisplay(true)
          setAddressError(t('reusable:errors:google-error-2'))
        } else {
          setAddressErrorDisplay(true)
          setAddressError(error.message)
        }
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

  if (ready) {
    return (
      <>
        <Divider />
        <p className='small-centered-paragraph'>
          {t('AddressUpdateForm:main-title')}
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
              placeholder={t('AddressUpdateForm:address-search-plch')}
              required
              id='userInputAddress'
              value={userInputAddress}
              onChange={e => setUserInputAddress(e.target.value)}
              onKeyPress={e => { e.key === 'Enter' && geolocationDataAddress() }}
              iconPosition='right'
              icon={<Icon id='search' name='search' link onClick={() => geolocationDataAddress()} style={{ 'color': '#c90c61' }} />}
            />
          </div>
          :
          <div className='required field'>
            <p style={{ 'textAlign': 'center' }}>
              {newAddress}&nbsp;
              <Header as='strong' id='change-address-link' onClick={() => backToSearch()} className='fake-link-underlined'>
                {t('AddressUpdateForm:not-right')}
              </Header>
            </p>
          </div>
        }
        {errorDisplay &&
          <Message negative >
            <Message.Header style={{ 'textAlign': 'center' }} >{t('reusable:errors:action-error-header')}</Message.Header>
            <ul id='message-error-list'>
              {errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        }
        <div className='button-wrapper'>
          <Button secondary id='address-close-button' className='cancel-button' onClick={() => props.closeAllForms()}>{t('reusable:cta:close')}</Button>
          <Button loading={loading} disabled={loading} id='address-submit-button' className='submit-button' onClick={() => updateAddress()}>{t('reusable:cta:save')}</Button>
        </div>
        <Divider style={{ 'marginBottom': '2rem' }} />
      </>
    )
  } else { return <Spinner /> }
}

export default AddressUpdateForm
