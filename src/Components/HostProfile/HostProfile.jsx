import React, { Component } from 'react'
import axios from 'axios'
import Geocode from 'react-geocode'
import { Divider, Header, Form, Button, Message, Segment, Icon } from 'semantic-ui-react'
import { generateRandomNumber } from '../../Modules/locationRandomizer'
import { search } from '../../Modules/addressLocationMatcher'
import MaxCatsUpdateForm from './MaxCatsUpdateForm'
import DescriptionUpdateForm from './DescriptionUpdateForm'
import RateUpdateForm from './RateUpdateForm'
import SupplementUpdateForm from './SupplementUpdateForm'
import AvailabilityUpdateForm from './AvailabilityUpdateForm'
import AvailabilityViewOnlyMode from './AvailabilityViewOnlyMode'

class HostProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      description: '',
      fullAddress: '',
      rate: '',
      maxCats: '',
      supplement: '',
      availability: [],
      selectedDays: [],
      errors: '',
      errorDisplay: false,
      loading: false,
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false,
      editAddress: false,
      addressSearch: false,
      addressErrorDisplay: false,
      addressError: '',
      newAddress: '',
      lat: '',
      long: '',
      latitude: '',
      longitude: '',
      userInputAddress: ''
    }
  }

  componentDidMount() {
    const path = `/api/v1/host_profiles/${this.props.id}`
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    axios.get(path, { headers: headers })
      .then(response => {
        this.setState({
          description: response.data.description,
          fullAddress: response.data.full_address,
          rate: response.data.price_per_day_1_cat,
          maxCats: response.data.max_cats_accepted,
          supplement: response.data.supplement_price_per_cat_per_day,
          availability: response.data.availability,
          selectedDays: response.data.availability.map(function (date) {
            return new Date(date)
          }),
          userInputAddress: response.data.full_address
        })
      })
      .catch(error => {
        this.setState({
          errorDisplay: true,
          errors: error.response.data.errors.full_messages
        })
      })
  }

  closeAllForms = () => {
    this.setState({
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false,
      addressSearch: false,
      editAddress: false,
      newAddress: '',
      selectedDays: this.state.availability.map(function (date) {
        return new Date(date)
      }),
      userInputAddress: '',
      lat: '',
      long: '',
      latitude: '',
      longitude: '',
      addressErrorDisplay: false,
      addressError: '',
      errorDisplay: false,
      errors: ''
    })
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  descriptionFormHandler = () => {
    this.setState({
      editDescriptionForm: !this.state.editDescriptionForm,
      newAddress: '',
      errorDisplay: false,
      errors: '',
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false,
      addressSearch: false,
      editAddress: false,
      selectedDays: this.state.availability.map(function (date) {
        return new Date(date)
      }),
      userInputAddress: '',
      lat: '',
      long: '',
      latitude: '',
      longitude: '',
      addressError: '',
      addressErrorDisplay: false
    })
    this.props.closeLocPasForms()
  }

  addressFormHandler = () => {
    this.setState({
      editAddress: !this.state.editAddress,
      addressSearch: true,
      newAddress: this.state.fullAddress,
      userInputAddress: this.state.fullAddress,
      lat: '',
      long: '',
      latitude: '',
      longitude: '',
      errorDisplay: false,
      selectedDays: this.state.availability.map(function (date) {
        return new Date(date)
      }),
      errors: '',
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false,
      addressError: '',
      addressErrorDisplay: false
    })
    this.props.closeLocPasForms()
  }

  maxCatsFormHandler = () => {
    this.setState({
      editMaxCatsForm: !this.state.editMaxCatsForm,
      newAddress: '',
      errorDisplay: false,
      errors: '',
      editDescriptionForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false,
      addressSearch: false,
      editAddress: false,
      selectedDays: this.state.availability.map(function (date) {
        return new Date(date)
      }),
      userInputAddress: '',
      lat: '',
      long: '',
      latitude: '',
      longitude: '',
      addressError: '',
      addressErrorDisplay: false
    })
    this.props.closeLocPasForms()
  }

  rateFormHandler = () => {
    this.setState({
      editRateForm: !this.state.editRateForm,
      newAddress: '',
      errorDisplay: false,
      errors: '',
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editSupplementForm: false,
      editableCalendar: false,
      addressSearch: false,
      editAddress: false,
      selectedDays: this.state.availability.map(function (date) {
        return new Date(date)
      }),
      userInputAddress: '',
      lat: '',
      long: '',
      latitude: '',
      longitude: '',
      addressError: '',
      addressErrorDisplay: false
    })
    this.props.closeLocPasForms()
  }

  supplementFormHandler = () => {
    this.setState({
      editSupplementForm: !this.state.editSupplementForm,
      newAddress: '',
      errorDisplay: false,
      errors: '',
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editableCalendar: false,
      addressSearch: false,
      editAddress: false,
      selectedDays: this.state.availability.map(function (date) {
        return new Date(date)
      }),
      userInputAddress: '',
      lat: '',
      long: '',
      latitude: '',
      longitude: '',
      addressError: '',
      addressErrorDisplay: false
    })
    this.props.closeLocPasForms()
  }

  availabilityFormHandler = () => {
    this.setState({
      editableCalendar: !this.state.editableCalendar,
      newAddress: '',
      errorDisplay: false,
      errors: '',
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      addressSearch: false,
      editAddress: false,
      selectedDays: this.state.availability.map(function (date) {
        return new Date(date)
      }),
      userInputAddress: '',
      lat: '',
      long: '',
      latitude: '',
      longitude: '',
      addressError: '',
      addressErrorDisplay: false
    })
    this.props.closeLocPasForms()
  }

  updateAddress = (e) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
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
          errorDisplay: false,
          fullAddress: this.state.newAddress,
          editAddress: false
        })
        window.alert('Your address was succesfully updated!')
      })
      .catch(error => {
        this.setState({
          loading: false,
          errorDisplay: true,
          errors: error.response.data.errors.full_messages
        })
      })
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

    let editDescriptionForm
    let editMaxCatsForm
    let editRateForm
    let editSupplementForm
    let addressFormSubmitButton
    let calendar
    let addressSearch
    let errorDisplay
    let addressErrorMessage
    const rate = parseFloat(this.state.rate)
    const supplement = parseFloat(this.state.supplement)



    if (this.state.errorDisplay) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>Update action could not be completed because of following error(s):</Message.Header>
          <ul id='message-error-list'>
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.loading) {
      addressFormSubmitButton = (
        <Button loading id='address-submit-button' className='submit-button'>Save</Button>
      )
    } else {
      if (this.state.fullAddress !== this.state.newAddress && this.state.newAddress !== '') {
        addressFormSubmitButton = (
          <Button id='address-submit-button' className='submit-button' onClick={this.updateAddress}>Save</Button>
        )
      } else {
        addressFormSubmitButton = (
          <Button disabled id='address-submit-button' className='submit-button'>Save</Button>
        )
      }
    }

    if (this.state.editDescriptionForm) {
      editDescriptionForm = (
        <DescriptionUpdateForm
          description={this.state.description}
          id={this.props.id}
          closeAllForms={this.closeAllForms.bind(this)}
        />
      )
    }

    if (this.state.editMaxCatsForm) {
      editMaxCatsForm = (
        <MaxCatsUpdateForm
          maxCats={this.state.maxCats}
          id={this.props.id}
          closeAllForms={this.closeAllForms.bind(this)}
        />
      )
    }

    if (this.state.editRateForm) {
      editRateForm = (
        <RateUpdateForm
          rate={this.state.rate}
          id={this.props.id}
          closeAllForms={this.closeAllForms.bind(this)}
        />
      )
    }

    if (this.state.editSupplementForm) {
      editSupplementForm = (
        <SupplementUpdateForm
          supplement={this.state.supplement}
          id={this.props.id}
          closeAllForms={this.closeAllForms.bind(this)}
        />
      )
    }

    if (this.state.editableCalendar) {
      calendar = (
        <AvailabilityUpdateForm
          selectedDays={this.state.selectedDays}
          availability={this.state.availability}
          id={this.props.id}
          closeAllForms={this.closeAllForms.bind(this)}
        />
      )
    } else {
      calendar = (
        <AvailabilityViewOnlyMode
          selectedDays={this.state.selectedDays}
        />
      )
    }



    if (this.state.addressErrorDisplay) {
      addressErrorMessage = (
        <Message negative >
          {this.state.addressError}
        </Message>
      )
    }

    if (this.state.editAddress) {
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
              <Button secondary id='address-close-button' className='cancel-button' onClick={this.addressFormHandler}>Close</Button>
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
              <Button secondary id='address-close-button' className='cancel-button' onClick={this.addressFormHandler}>Close</Button>
              {addressFormSubmitButton}
            </div>
            <Divider style={{ 'marginBottom': '2rem' }} />
          </>
        )
      }
    }


    return (
      <Segment className='whitebox'>
        <Header as='h1'>
          Your host profile
        </Header>
        <p style={{ 'textAlign': 'center' }}>
          This is your <strong> host </strong> profile. Here you can update all your cat hosting information.
        </p>

        <Divider hidden />
        <p id='description'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &nbsp;{this.state.description}&ensp;
          <Header as='strong' id='change-description-link' onClick={this.descriptionFormHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {editDescriptionForm}

        <p id='address'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" /></svg>
          &nbsp;{this.state.fullAddress}&ensp;
          <Header as='strong' id='change-address-link' onClick={this.addressFormHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {addressSearch}

        <p id='maxCats'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 236.62 236.62"><path d="M197.023,225.545c-1.145-9.533-11.68-10.614-17.805-9.958c-6.521-24.554,16.225-61.151,17.563-69.82c1.438-9.312-6.658-63.5-7.513-90.938C188.389,26.662,147.48-4.433,140.65,0.524c-6.768,7.484,9.748,17.585,1.054,26.245c-8.398,8.367-10.588,13.99-16.824,23.46c-15.976,24.255,27.318,24.558,27.318,24.558s-33.882,25.112-41.421,37.768c-6.943,11.656-9.854,24.696-18.232,35.688c-19.094,25.051-14.791,68.729-14.791,68.729s-36.17-11.839-16.264-53.133C76.643,132.406,84.107,86.02,50.016,97.95c-13.189,4.616,2.949,14.325,5.734,17.435c9.318,10.4,1.441,27.896-4.174,38.012c-15.037,27.091-20.496,55.475,11.154,72.978c14.063,7.776,33.055,9.7,52.17,9.982l48.64,0.14C179.564,237.294,197.689,234.298,197.023,225.545z" /></svg>
          &nbsp;Maximum cats: {this.state.maxCats}&ensp;
          <Header as='strong' id='change-maxCats-link' onClick={this.maxCatsFormHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {editMaxCatsForm}

        <p id='rate'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M18 6V4H2v2h16zm0 4H2v6h16v-6zM0 4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm4 8h4v2H4v-2z" /></svg>
          &nbsp;{rate} kr/day for 1 cat&ensp;
          <Header as='strong' id='change-rate-link' onClick={this.rateFormHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {editRateForm}

        <p id='supplement'>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" /></svg>
          &nbsp;Extra {supplement} kr/day per cat&ensp;
          <Header as='strong' id='change-supplement-link' onClick={this.supplementFormHandler} className='fake-link-underlined'>
            Change
          </Header>
        </p>
        {editSupplementForm}

        <p id='availability' style={{ 'marginBottom': '0' }}>
          <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" /></svg>
          &nbsp;Your availability&ensp;
          <Header as='strong' id='change-availability-link' onClick={this.availabilityFormHandler} className='fake-link-underlined' >
            Change
          </Header>
        </p>
        {calendar}
      </Segment>
    )
  }
}

export default HostProfile
