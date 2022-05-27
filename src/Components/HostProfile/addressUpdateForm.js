import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Geocode from 'react-geocode';

import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { formValidation, conditions as validate } from '../../Modules/formValidation';
import { generateRandomNumber } from '../../Modules/locationRandomizer';
import { search } from '../../Modules/addressLocationMatcher';

import { TextField, Button, Notice, Text, Flexbox } from '../../UI-Components';

const AddressUpdateForm = ({ fullAddress, id, setElement, closeAllForms, location }) => {
  const { t } = useTranslation('HostProfileForm');

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [userInputAddress, setUserInputAddress] = useState(fullAddress);

  useEffect(() => {
    return () => {
      setUserInputAddress(fullAddress)
    }
  }, [])

  const validator = formValidation({
    fields: [
      {
        condition: validate.nonEmptyString(userInputAddress),
        error: 'HostProfileForm:errors.address',
      },
      {
        condition: window.navigator.onLine === false,
        error: 'reusable:errors:window-navigator',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  const updateAddress = (address, lat, long, latitude, longitude) => {
    const lang = detectLanguage();
    setLoading(true);

    if (address === fullAddress) {
      closeAllForms();
      return;
    }
    const path = `/api/v1/host_profiles/${id}`;
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    const payload = {
      full_address: address,
      lat: lat,
      long: long,
      latitude: latitude,
      longitude: longitude,
      locale: lang,
    };
    axios
      .patch(path, payload, { headers: headers })
      .then(() => {
        setElement('fullAddress', address);
        closeAllForms();
        setErrors([]);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (error.response.status === 500) {
          setErrors(['reusable:errors.500']);
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors.401'));
          wipeCredentials('/');
        } else {
          setErrors([error.response.data.error]);
        }
      });
  };

  const searchAndUpdate = () => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE);
    Geocode.setLanguage('sv');
    Geocode.fromAddress(userInputAddress).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        if (search(location, response.results[0].address_components) === undefined) {
          if (window.confirm(t('reusable:alerts.no-match-address'))) {
            updateAddress(
              response.results[0].formatted_address,
              lat - generateRandomNumber(),
              lng + generateRandomNumber(),
              lat,
              lng
            );
          }
        } else {
          updateAddress(
            response.results[0].formatted_address,
            lat - generateRandomNumber(),
            lng + generateRandomNumber(),
            lat,
            lng
          );
        }
      },
      (error) => {
        if (error.message.includes('ZERO_RESULTS')) {
          setAddressError(t('reusable:errors:google-error-1'));
        } else if (error.message.includes('REQUEST_DENIED')) {
          setAddressError(t('reusable:errors:google-error-2'));
        } else {
          setAddressError(error.message);
        }
      }
    );
  };

  return (
    <>
      {addressError && (
        <Notice nature='danger'>
          <Text centered>{addressError}</Text>
        </Notice>
      )}
      <Text space={5}>{t('HostProfileForm:helpers.address')}</Text>
      <TextField
        space={5}
        data-cy='new'
        label={t('HostProfileForm:labels.address')}
        required
        value={userInputAddress}
        onChange={(e) => setUserInputAddress(e.target.value)}
      />
      {errors.length > 0 && (
        <Notice nature='danger' data-cy='error'>
          <ul>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      )}
      <Flexbox spaceItemsX={2}>
        <Button secondary color='neutral' data-cy='close' onClick={() => closeAllForms()}>
          {t('reusable:cta.cancel')}
        </Button>
        <Button
          data-cy='submit'
          color='info'
          loading={loading}
          disabled={loading}
          onClick={() => validator.onSubmit(searchAndUpdate)}
        >
          {t('reusable:cta.save')}
        </Button>
      </Flexbox>
    </>
  );
};

export default AddressUpdateForm;
