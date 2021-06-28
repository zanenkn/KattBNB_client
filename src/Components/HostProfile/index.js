import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MaxCatsUpdateForm from './MaxCatsUpdateForm';
import DescriptionUpdateForm from './DescriptionUpdateForm';
import RateUpdateForm from './RateUpdateForm';
import SupplementUpdateForm from './SupplementUpdateForm';
import AvailabilityUpdateForm from './AvailabilityUpdateForm';
import AvailabilityViewOnlyMode from './AvailabilityViewOnlyMode';
import AddressUpdateForm from './AddressUpdateForm';
import Spinner from '../ReusableComponents/Spinner';
import queryString from 'query-string';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { Header, Container, Text, TextField, Whitebox, Button, InlineLink, Notice } from '../../UI-Components';
import { FlexWrapper, UpdateFormWrapper } from './styles';
import { Address, Cat } from '../Icons';

const HostProfile = forwardRef((props, ref) => {
  const { t, ready } = useTranslation('HostProfile');

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    editDescriptionForm: false,
    editMaxCatsForm: false,
    editRateForm: false,
    editSupplementForm: false,
    editableCalendar: false,
    editAddress: false,
  });

  const createStripeAccount = async () => {
    if (window.navigator.onLine === false) {
      setLoading(false);
      return setErrors(['reusable:errors:window-navigator']);
    }
    try {
      const lang = detectLanguage();
      const path = `/api/v1/host_profiles/${props.id}`;
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      const payload = {
        code: queryString.parse(window.location.search).code,
        locale: lang,
      };
      const response = await axios.patch(path, payload, { headers: headers });
      props.setElement('stripeAccountId', response.data.id);
      setLoading(false);
      window.alert(t('HostProfile:stripe-success'));
      window.location.replace('/user-page');
    } catch (error) {
      if (error.response === undefined) {
        wipeCredentials('/is-not-available?atm');
      } else if (error.response.status === 555 || error.response.status === 455) {
        setLoading(false);
        setErrors([error.response.data.error]);
      } else if (error.response.status === 401) {
        window.alert(t('reusable:errors:401'));
        wipeCredentials('/');
      } else {
        setLoading(false);
        setErrors([error.response.data.error]);
      }
    }
  };

  useEffect(() => {
    if (
      queryString.parse(window.location.search).code &&
      queryString.parse(window.location.search).state === props.stripeState
    ) {
      createStripeAccount();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const closeAllForms = () => {
    setForm((old) => ({
      ...old,
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false,
      editAddress: false,
    }));
    setErrors([]);
  };

  useImperativeHandle(ref, () => ({
    closeAllForms() {
      closeAllForms();
    },
  }));

  const formHandler = (e) => {
    closeAllForms();
    let states = Object.keys(form);
    states.forEach((stt) => {
      if (stt === e.target.id) {
        setForm((old) => ({ ...old, [stt]: !form[stt] }));
      }
    });
    setErrors([]);
    props.closeLocPasForms();
  };

  if (!ready && loading) {
    return <Spinner />;
  }

  return (
    <Whitebox>
      <Header centered level={4}>
        {t('HostProfile:main-header')}
      </Header>
      {errors.length > 0 && (
        <Notice nature='danger'>
          <Header centered level={5}>
            {t('reusable:errors:action-error-header')}
          </Header>
          <ul id='message-error-list'>
            {errors.map((error) => (
              <li key={error}>{t(error)}</li>
            ))}
          </ul>
        </Notice>
      )}
      {/* <p id='description'>
            <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path d='M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z' />
            </svg>
            &nbsp;{props.description}&ensp;
            <Header
              as='strong'
              id='editDescriptionForm'
              onClick={(e) => formHandler(e)}
              className='fake-link-underlined'
            >
              {t('reusable:cta:change')}
            </Header>
          </p>
          <div
            style={{
              maxHeight: form.editDescriptionForm ? '1000px' : '0px',
              height: 'auto',
              overflow: 'hidden',
              transition: 'max-height 1s ease-in-out',
            }}
          >
            {form.editDescriptionForm && (
              <DescriptionUpdateForm
                description={props.description}
                id={props.id}
                closeAllForms={closeAllForms.bind(this)}
                setElement={props.setElement}
              />
            )}
          </div> */}
      <FlexWrapper spaceBetween={2} id='address'>
        <Address />
        <Text>{props.fullAddress}</Text>
        <InlineLink id='editAddress' onClick={(e) => formHandler(e)} text='sm' color='info'>
          {t('reusable:cta:change')}
        </InlineLink>
      </FlexWrapper>

      <UpdateFormWrapper open={form.editAddress}>
        <AddressUpdateForm
          fullAddress={props.fullAddress}
          id={props.id}
          closeAllForms={closeAllForms.bind(this)}
          location={props.location}
          setElement={props.setElement}
        />
      </UpdateFormWrapper>

      <FlexWrapper spaceBetween={2} id='maxCats'>
        <Cat />
        <Text>
          {t('HostProfile:max-cats')} {props.maxCats}
        </Text>
        <InlineLink id='editMaxCatsForm' onClick={(e) => formHandler(e)} text='sm' color='info'>
          {t('reusable:cta:change')}
        </InlineLink>
      </FlexWrapper>

      {/* <div
            style={{
              maxHeight: form.editMaxCatsForm ? '1000px' : '0px',
              height: 'auto',
              overflow: 'hidden',
              transition: 'max-height 1s ease-in-out',
            }}
          >
            {form.editMaxCatsForm && (
              <MaxCatsUpdateForm
                maxCats={props.maxCats}
                id={props.id}
                closeAllForms={closeAllForms.bind(this)}
                setElement={props.setElement}
              />
            )}
          </div>
          <p id='rate'>
            <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path d='M18 6V4H2v2h16zm0 4H2v6h16v-6zM0 4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm4 8h4v2H4v-2z' />
            </svg>
            &nbsp;{props.rate} {t('reusable:price:total-for-1')}&ensp;
            <Header as='strong' id='editRateForm' onClick={(e) => formHandler(e)} className='fake-link-underlined'>
              {t('reusable:cta:change')}
            </Header>
          </p>
          <div
            style={{
              maxHeight: form.editRateForm ? '1000px' : '0px',
              height: 'auto',
              overflow: 'hidden',
              transition: 'max-height 1s ease-in-out',
            }}
          >
            {form.editRateForm && (
              <RateUpdateForm
                rate={props.rate}
                id={props.id}
                closeAllForms={closeAllForms.bind(this)}
                setElement={props.setElement}
              />
            )}
          </div>
          <p id='supplement'>
            <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path d='M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z' />
            </svg>
            &nbsp;{t('HostProfile:extra')} {props.supplement} {t('reusable:price:total-day')}&ensp;
            <Header
              as='strong'
              id='editSupplementForm'
              onClick={(e) => formHandler(e)}
              className='fake-link-underlined'
            >
              {t('reusable:cta:change')}
            </Header>
          </p>
          <div
            style={{
              maxHeight: form.editSupplementForm ? '1000px' : '0px',
              height: 'auto',
              overflow: 'hidden',
              transition: 'max-height 1s ease-in-out',
            }}
          >
            {form.editSupplementForm && (
              <SupplementUpdateForm
                supplement={props.supplement}
                id={props.id}
                closeAllForms={closeAllForms.bind(this)}
                setElement={props.setElement}
              />
            )}
          </div>
          <p id='availability' style={{ marginBottom: '0' }}>
            <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path d='M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z' />
            </svg>
            &nbsp;{t('HostProfile:availability')}&ensp;
            <Header as='strong' id='editableCalendar' onClick={(e) => formHandler(e)} className='fake-link-underlined'>
              {t('reusable:cta:change')}
            </Header>
          </p>
          {form.editableCalendar ? (
            <AvailabilityUpdateForm
              selectedDays={props.availability.map(function (date) {
                return new Date(date);
              })}
              availability={props.availability}
              id={props.id}
              incomingBookings={props.incomingBookings}
              closeAllForms={closeAllForms.bind(this)}
            />
          ) : (
            <AvailabilityViewOnlyMode
              selectedDays={props.availability.map(function (date) {
                return new Date(date);
              })}
            />
          )} */}
    </Whitebox>
  );
});

HostProfile.displayName = 'HostProfile';

export default HostProfile;
