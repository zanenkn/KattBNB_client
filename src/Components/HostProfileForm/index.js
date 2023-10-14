import React, { useState } from 'react';

import { useTranslation, Trans } from 'react-i18next';
import Geocode from 'react-geocode';
import axios from 'axios';
import { connect } from 'react-redux';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import withAuth from '../../HOC/withAuth';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { generateRandomNumber } from '../../Modules/locationRandomizer';
import { search } from '../../Modules/addressLocationMatcher';
import { formValidation, conditions as validate } from '../../Modules/formValidation';

import Spinner from '../../common/Spinner';

import {
  ContentWrapper,
  Text,
  Header,
  TextArea,
  TextField,
  Flexbox,
  Button,
  Notice,
  InlineLink,
  Container,
} from '../../UI-Components';
import { AddressSearchWrapper, Label, StackableWrapper } from './styles';
import useCurrentScope from '../../hooks/useCurrentScope';

const HostProfileForm = ({ userId, location }) => {
  const { t, ready } = useTranslation('HostProfileForm');
  const history = useHistory();

  const [newHost, setNewHost] = useState({
    description: '',
    rate: '',
    maxCats: '',
    supplement: undefined,
    latitude: '',
    longitude: '',
    lat: '',
    long: '',
    address: '',
  });
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [addressSearch, setAddressSearch] = useState(true);
  const [userInputAddress, setUserInputAddress] = useState('');
  const [addressErrors, setAddressError] = useState(null);

  const today = new Date();
  const { locale } = useCurrentScope();

  const validator = formValidation({
    fields: [
      {
        condition: validate.nonEmptyString(newHost.description),
        error: 'HostProfileForm:errors.about',
      },
      {
        condition: validate.nonEmptyString(newHost.maxCats),
        error: 'HostProfileForm:errors.max-cats',
      },
      {
        condition: validate.nonEmptyString(newHost.rate),
        error: 'HostProfileForm:errors.rate',
      },
      {
        condition: validate.nonEmptyString(newHost.supplement),
        error: 'HostProfileForm:errors.supplement',
      },
      {
        condition: validate.nonEmptyArray(selectedDays),
        error: 'HostProfileForm:errors.availability',
      },
      {
        condition: validate.nonEmptyString(newHost.address),
        error: 'HostProfileForm:errors.address',
      },
      {
        condition: window.navigator.onLine === false,
        error: 'reusable:errors:window-navigator',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  const convertToMs = (day) => {
    let date = new Date(day);
    let utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return new Date(utc).getTime();
  };

  const handleDayClick = (day) => {
    const today = new Date();
    const selected = selectedDays.some((selected) => selected.getTime() === day.getTime());
    if (day > today) {
      if (selected) {
        setSelectedDays((prev) => [...prev.filter((existing) => existing.getTime() !== day.getTime())]);
      } else {
        setSelectedDays((prev) => [...prev, day]);
      }
    }
  };

  const geolocationDataAddress = () => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE);
    Geocode.setLanguage('sv');
    Geocode.fromAddress(userInputAddress).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        if (search(location, response.results[0].address_components) === undefined) {
          if (window.confirm(t('reusable:alerts.no-match-address'))) {
            setNewHost((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              lat: lat - generateRandomNumber(),
              long: lng + generateRandomNumber(),
              address: response.results[0].formatted_address,
            }));
            setAddressSearch(false);
            setAddressError(null);
          }
        } else {
          setNewHost((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            lat: lat - generateRandomNumber(),
            long: lng + generateRandomNumber(),
            address: response.results[0].formatted_address,
          }));
          setAddressSearch(false);
          setAddressError(null);
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

  const createHostProfile = () => {
    setLoading(true);

    const path = '/api/v1/host_profiles';
    const payload = {
      description: newHost.description,
      full_address: newHost.address,
      price_per_day_1_cat: newHost.rate,
      supplement_price_per_cat_per_day: newHost.supplement ?? 0,
      max_cats_accepted: newHost.maxCats,
      user_id: userId,
      locale: locale,
      availability: selectedDays.map((day) => convertToMs(day)).sort((a, b) => a - b),
      lat: newHost.lat,
      long: newHost.long,
      latitude: newHost.latitude,
      longitude: newHost.longitude,
    };
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    axios
      .post(path, payload, { headers: headers })
      .then(() => {
        history.push('/user-page');
      })
      .catch((error) => {
        if (error.response === undefined) {
          setErrors(['reusable:errors:unknown']);
        } else if (error.response.status === 500) {
          setLoading(false);
          setErrors((prev) => [...prev, ['reusable:errors:500']]);
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setLoading(false);
          setErrors((prev) => [...prev, [error.response.data.error]]);
        }
      });
  };

  if (!ready) return <Spinner page />;

  return (
    <ContentWrapper data-cy='create-host-profile-form'>
      <Header centered level={3} color='primary' space={2}>
        {t('HostProfileForm:create-profile')}
      </Header>
      <Text centered>{t('HostProfileForm:create-profile-main-title')}</Text>
      <TextArea
        data-cy='description'
        space={2}
        label={t('HostProfileForm:labels.about')}
        value={newHost.description}
        onChange={(e) => setNewHost((prev) => ({ ...prev, description: e.target.value }))}
        required
      />
      <Text space={6} size='sm'>
        <Trans i18nKey={'HostProfileForm:helpers.about'}>
          text
          <InlineLink color='info' as={Link} to='/blog/hur-skapar-man-en-bra-kattvaktsprofil' target='_blank'>
            link
          </InlineLink>
        </Trans>
      </Text>

      {addressErrors && (
        <Notice nature='danger'>
          <Text centered>{addressErrors}</Text>
        </Notice>
      )}

      {addressSearch ? (
        <AddressSearchWrapper spaceItemsX={2} space={2}>
          <Container space={0}>
            <TextField
              space={0}
              style={{ flexGrow: 1 }}
              label={t('HostProfileForm:labels.address')}
              required
              data-cy='address'
              value={userInputAddress}
              onChange={(e) => setUserInputAddress(e.target.value)}
              onBlur={() => (userInputAddress !== '' ? geolocationDataAddress() : undefined)}
            />
          </Container>
          <Button id='search' onClick={() => geolocationDataAddress()}>
            {t('reusable:cta:confirm')}
          </Button>
        </AddressSearchWrapper>
      ) : (
        <>
          <Label>{t('HostProfileForm:labels.address')}</Label>
          <Flexbox spaceItemsX={2} horizontalAlign='left' space={6}>
            <Text>{newHost.address}</Text>
            <InlineLink
              color='info'
              onClick={() => {
                setAddressSearch(true);
                setNewHost((prev) => ({
                  ...prev,
                  address: '',
                  lat: '',
                  long: '',
                  latitude: '',
                  longitude: '',
                }));
              }}
            >
              {t('HostProfileForm:not-right')}
            </InlineLink>
          </Flexbox>
        </>
      )}
      <Text space={6} size='sm'>
        {t('HostProfileForm:helpers.address')}
      </Text>
      <StackableWrapper space={2}>
        <Container>
          <TextField
            space={2}
            type='number'
            label={t('HostProfileForm:labels.rate')}
            data-cy='rate'
            value={newHost.rate}
            onChange={(e) => setNewHost((prev) => ({ ...prev, rate: (Math.abs(e.target.value) || '').toString() }))}
            required
            onKeyPress={(e) => e.key === 'Enter' && validator.onSubmit(createHostProfile)}
          />
          <Text space={6} size='sm'>
            {t('HostProfileForm:helpers.rate')}
          </Text>
        </Container>
        <Container>
          <TextField
            space={2}
            min='1'
            type='number'
            label={t('HostProfileForm:labels.max-cats')}
            data-cy='max-cats'
            value={newHost.maxCats}
            onChange={(e) =>
              setNewHost((prev) => ({ ...prev, maxCats: (Math.round(Math.abs(e.target.value)) || '').toString() }))
            }
            required
            onKeyPress={(e) => e.key === 'Enter' && validator.onSubmit(createHostProfile)}
          />
          <Text space={6} size='sm'>
            {t('HostProfileForm:helpers.max-cats')}
          </Text>
        </Container>
        {newHost.maxCats > 1 && (
          <Container>
            <TextField
              space={2}
              type='number'
              label={t('HostProfileForm:labels.supplement')}
              data-cy='supplement'
              value={newHost.supplement}
              onChange={(e) => setNewHost((prev) => ({ ...prev, supplement: Math.abs(e.target.value).toString() }))}
              required
              onKeyPress={(e) => e.key === 'Enter' && validator.onSubmit(createHostProfile)}
            />
            <Text space={6} size='sm'>
              {t('HostProfileForm:helpers.supplement')}
            </Text>
          </Container>
        )}
      </StackableWrapper>
      <Notice nature='info' space={6}>
        <Text bold space={2}>
          {t('HostProfileForm:helpers.example-title')}
        </Text>
        <Text>{t('reusable:explain-supplement')}</Text>
      </Notice>

      <Label>{t('HostProfileForm:labels.availability')}</Label>
      <Text>{t('HostProfileForm:helpers.availability')}</Text>
      <Container space={8} data-cy='availability'>
        <DayPicker
          showWeekNumbers
          fromMonth={today}
          disabledDays={{ before: today }}
          firstDayOfWeek={1}
          selectedDays={selectedDays}
          onDayClick={(day) => handleDayClick(day)}
          localeUtils={MomentLocaleUtils}
          locale={locale}
        />
      </Container>
      {errors.length > 0 && (
        <Notice nature='danger' data-cy='errors'>
          <Text bold centered>
            {t('HostProfileForm:create-error-title')}
          </Text>
          <ul>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      )}
      <Text centered space={6}>
        {t('HostProfileForm:disclaimer')}
      </Text>
      <Button
        data-cy='submit'
        disabled={loading}
        loading={loading}
        onClick={() => validator.onSubmit(createHostProfile)}
      >
        {t('HostProfileForm:cta')}
      </Button>
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({
  location: state.reduxTokenAuth.currentUser.attributes.location,
  userId: state.reduxTokenAuth.currentUser.attributes.id,
});

export default connect(mapStateToProps)(withAuth(HostProfileForm));
