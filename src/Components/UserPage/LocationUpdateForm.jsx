import React, { Component } from 'react'
import { LOCATION_OPTIONS } from '../../Modules/locationData'
import axios from 'axios'
import { Form, Dropdown, Button, Message, Divider } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next'

class LocationUpdateForm extends Component {

  state = {
    newLocation: '',
    loading: false,
    errorDisplay: false,
    errors: ''
  }

  listenEnterKeyLocation = (event) => {
    if (event.key === 'Enter') {
      this.updateLocation(event)
    }
  }

  handleLocationChange = (e, { value }) => {
    this.setState({ newLocation: value })
  }

  updateLocation = (e) => {
    const { t } = this.props
    let address = this.props.fullAddress
    if (window.localStorage.getItem('access-token') === '' || window.localStorage.getItem('access-token') === null) {
      window.localStorage.removeItem('access-token')
      window.localStorage.removeItem('token-type')
      window.localStorage.removeItem('client')
      window.localStorage.removeItem('uid')
      window.localStorage.removeItem('expiry')
      window.location.replace('/login')
    } else if (this.state.newLocation === this.props.location || this.state.newLocation === '') {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['no-location-error']
      })
    } else if (address !== '' && address.includes(this.state.newLocation) === false) {
      if (window.confirm(t('LocationUpdateForm:no-match-alert'))) {
        this.setState({ loading: true })
        e.preventDefault()
        const path = '/api/v1/auth/'
        const payload = { location: this.state.newLocation }
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        axios.put(path, payload, { headers: headers })
          .then(() => {
            this.setState({
              loading: false,
              errorDisplay: false,
              errors: ''
            })
            window.alert(t('success-alert'))
            this.props.setElement('location', this.state.newLocation)
            this.props.closeLocationAndPasswordForms()
          })
          .catch(error => {
            this.setState({
              loading: false,
              errorDisplay: true,
              errors: error.response.data.errors.full_messages
            })
          })
      }
    } else {
      this.setState({ loading: true })
      e.preventDefault()
      const path = '/api/v1/auth/'
      const payload = { location: this.state.newLocation }
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.put(path, payload, { headers: headers })
        .then(() => {
          this.setState({
            loading: false,
            errorDisplay: false,
            errors: ''
          })
          window.alert(t('LocationUpdateForm:success-alert'))
          this.props.setElement('location', this.state.newLocation)
          this.props.closeLocationAndPasswordForms()
        })
        .catch(error => {
          this.setState({
            loading: false,
            errorDisplay: true,
            errors: error.response.data.errors.full_messages
          })
        })
    }
  }

  render() {
    const { t } = this.props

    if (this.props.tReady) {
      let errorDisplay

      if (this.state.errorDisplay) {
        errorDisplay = (
          <Message negative style={{ 'width': 'inherit' }} >
            <Message.Header style={{ 'textAlign': 'center' }}>{t('reusable:errors.action-error-header')}</Message.Header>
            <ul id='message-error-list'>
              {this.state.errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )
      }

      return (
        <>
          <Divider />
          <Form style={{ 'maxWidth': '194px', 'margin': 'auto' }}>
            <Dropdown
              clearable
              search
              selection
              placeholder={t('LocationUpdateForm:new-location-plch')}
              options={LOCATION_OPTIONS}
              id='location'
              style={{ 'width': '100%' }}
              onChange={this.handleLocationChange}
              onKeyPress={this.listenEnterKeyLocation}
            />
            {errorDisplay}
          </Form>
          <div className='button-wrapper'>
            <Button secondary className='cancel-button' onClick={this.props.closeLocationAndPasswordForms}>{t('reusable:cta.close')}</Button>
            <Button id='location-submit-button' className='submit-button' disabled={this.state.loading} loading={this.state.loading} onClick={this.updateLocation}>{t('reusable:cta.change')}</Button>
          </div>
          <Divider style={{ 'marginBottom': '2rem' }} />
        </>
      )
    } else { return null }
  }
}

export default withTranslation('LocationUpdateForm')(LocationUpdateForm)
