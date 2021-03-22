import React, { useState } from 'react';
import { LOCATION_OPTIONS } from '../../Modules/locationData';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { Form, Dropdown, Button, Message, Divider } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';

const LocationUpdateForm = ({ closeLocationAndPasswordForms, fullAddress, location }) => {
  const { t, ready } = useTranslation('LocationUpdateForm');

  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errors, setErrors] = useState([]);

  const listenEnterKeyLocation = (event) => {
    if (event.key === 'Enter') {
      updateLocation();
    }
  };

  const APIerrorHandling = (errorResponse) => {
    setLoading(false);
    setErrorDisplay(true);
    setErrors(errorResponse);
  };

  const axiosCall = () => {
    setLoading(true);
    const lang = detectLanguage();
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    const path = '/api/v1/auth/';
    const payload = {
      location: newLocation,
      locale: lang,
    };
    axios
      .put(path, payload, { headers: headers })
      .then(() => {
        window.alert(t('LocationUpdateForm:success-alert'));
        window.location.reload();
      })
      .catch(({ response }) => {
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 500) {
          APIerrorHandling(['reusable:errors:500']);
        } else if (response.status === 503) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 401 || response.status === 404) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          APIerrorHandling(response.data.errors.full_messages);
        }
      });
  };

  const updateLocation = () => {
    let address = fullAddress;
    if (window.navigator.onLine === false) {
      APIerrorHandling(['reusable:errors:window-navigator']);
    } else {
      if (newLocation === location || newLocation === '') {
        APIerrorHandling(['no-location-error']);
      } else if (address !== '' && address.includes(newLocation) === false) {
        if (window.confirm(t('LocationUpdateForm:no-match-alert'))) {
          axiosCall();
        }
      } else {
        axiosCall();
      }
    }
  };

  if (ready) {
    return (
      <>
        <Divider />
        <Form style={{ maxWidth: '194px', margin: 'auto' }}>
          <Dropdown
            clearable
            search
            selection
            placeholder={t('LocationUpdateForm:new-location-plch')}
            options={LOCATION_OPTIONS}
            id='location'
            style={{ width: '100%' }}
            onChange={(e, { value }) => setNewLocation(value)}
            onKeyPress={listenEnterKeyLocation}
          />
          {errorDisplay && (
            <Message negative style={{ width: 'inherit' }}>
              <Message.Header style={{ textAlign: 'center' }}>
                {t('reusable:errors.action-error-header')}
              </Message.Header>
              <ul id='message-error-list'>
                {errors.map((error) => (
                  <li key={error}>{t(error)}</li>
                ))}
              </ul>
            </Message>
          )}
        </Form>
        <div className='button-wrapper'>
          <Button secondary className='cancel-button' onClick={closeLocationAndPasswordForms}>
            {t('reusable:cta.close')}
          </Button>
          <Button
            id='location-submit-button'
            className='submit-button'
            disabled={loading}
            loading={loading}
            onClick={updateLocation}
          >
            {t('reusable:cta.change')}
          </Button>
        </div>
        <Divider style={{ marginBottom: '2rem' }} />
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default LocationUpdateForm;
