import React, { useState } from 'react';
import LOCATION_OPTIONS from '../../Modules/locationData.json';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { useTranslation } from 'react-i18next';
import Spinner from '../../common/Spinner';
import { Button, Notice, Dropdown, Text, Divider } from '../../UI-Components';
import { ButtonWrapper } from './styles';
// Migrated, Waiting for dropdown

const LocationUpdateForm = ({ closeLocationAndPasswordForms, fullAddress, location }) => {
  const { t, ready } = useTranslation('LocationUpdateForm');

  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [info, setInfo] = useState(null);

  const listenEnterKeyLocation = (event) => {
    if (event.key === 'Enter') {
      updateLocation();
    }
  };

  const APIerrorHandling = (errorResponse) => {
    setLoading(false);
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
      return APIerrorHandling(['reusable:errors:window-navigator']);
    }

    if (newLocation === location || newLocation === '') {
      setLoading(false);
      return setInfo(['no-location-error']);
    }

    if (address !== '' && address.includes(newLocation) === false) {
      return window.confirm(t('LocationUpdateForm:no-match-alert')) && axiosCall();
    }

    axiosCall();
  };

  if (!ready) {
    return <Spinner />;
  }

  return (
    <>
      <Divider bottom={5}/>
      <Dropdown
        label={t('LocationUpdateForm:new-location-plch')}
        data={LOCATION_OPTIONS}
        id='location'
        onChange={(val) => setNewLocation(val)}
        onKeyPress={listenEnterKeyLocation}
      />

      {errors.length > 0 && (
        <Notice nature='danger'>
          <Text bold centered size='sm'>
            {t('reusable:errors.action-error-header')}
          </Text>
          <ul id='message-error-list'>
            {errors.map((error) => (
              <li key={error}>{t(error)}</li>
            ))}
          </ul>
        </Notice>
      )}

      {info && (
        <Notice nature='info'>
          <Text centered>{t(info)}</Text>
        </Notice>
      )}

      <ButtonWrapper>
        <Button secondary color='neutral' onClick={closeLocationAndPasswordForms}>
          {t('reusable:cta.cancel')}
        </Button>
        <Button id='location-submit-button' color='info' disabled={loading} loading={loading} onClick={updateLocation}>
          {t('reusable:cta.save')}
        </Button>
      </ButtonWrapper>
      <Divider top={5} bottom={6}/>
    </>
  );
};

export default LocationUpdateForm;
