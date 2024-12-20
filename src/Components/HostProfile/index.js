import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import axios from 'axios';
import { connect } from 'react-redux';

import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';

import Spinner from '../../common/Spinner';
import Responsive from '../../common/Responsive';
import Share from '../../common/Share';

import { Header, Text, Whitebox, InlineLink, Notice, Divider } from '../../UI-Components';
import { FlexWrapper, UpdateFormWrapper, DescriptionWrapper } from './styles';
import { Address, Cat, Rate, Supplement, Availabilty, User } from '../../icons';

import MaxCatsUpdateForm from './maxCatsUpdateForm';
import DescriptionUpdateForm from './descriptionUpdateForm';
import RateUpdateForm from './rateUpdateForm';
import SupplementUpdateForm from './supplementUpdateForm';
import AvailabilityUpdateForm from './availabilityUpdateForm';
import AvailabilityViewOnlyMode from './availabilityViewOnlyMode';
import AddressUpdateForm from './addressUpdateForm';

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
    <Whitebox data-cy='host-profile'>
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

      <DescriptionWrapper data-cy='description'>
        <User />
        {props.description}
        <InlineLink id='editDescriptionForm' data-cy='change' onClick={(e) => formHandler(e)} text='sm' color='info'>
          {t('reusable:cta:change')}
        </InlineLink>
      </DescriptionWrapper>

      <UpdateFormWrapper open={form.editDescriptionForm} data-cy='description-update-form'>
        <DescriptionUpdateForm
          description={props.description}
          id={props.id}
          closeAllForms={closeAllForms.bind(this)}
          setElement={props.setElement}
        />
      </UpdateFormWrapper>

      <DescriptionWrapper data-cy='address'>
        <Address />
        {props.fullAddress}
        <InlineLink id='editAddress' data-cy='change' onClick={(e) => formHandler(e)} text='sm' color='info'>
          {t('reusable:cta:change')}
        </InlineLink>
      </DescriptionWrapper>

      <UpdateFormWrapper open={form.editAddress} data-cy='address-update-form'>
        <AddressUpdateForm
          fullAddress={props.fullAddress}
          id={props.id}
          closeAllForms={closeAllForms.bind(this)}
          location={props.location}
          setElement={props.setElement}
        />
      </UpdateFormWrapper>

      <FlexWrapper spaceBetween={2} data-cy='rate'>
        <Rate />
        <Text>
          {props.rate} {t('reusable:price:total-for-1')}
        </Text>
        <InlineLink id='editRateForm' data-cy='change' onClick={(e) => formHandler(e)} text='sm' color='info'>
          {t('reusable:cta:change')}
        </InlineLink>
      </FlexWrapper>

      <UpdateFormWrapper open={form.editRateForm} data-cy='rate-update-form'>
        <RateUpdateForm
          rate={props.rate}
          id={props.id}
          closeAllForms={closeAllForms.bind(this)}
          setElement={props.setElement}
        />
      </UpdateFormWrapper>

      <FlexWrapper spaceBetween={2} data-cy='supplement'>
        <Supplement />
        <Text>
          {t('HostProfile:extra')} {props.supplement} {t('reusable:price:total-day')}
        </Text>
        <InlineLink id='editSupplementForm' data-cy='change' onClick={(e) => formHandler(e)} text='sm' color='info'>
          {t('reusable:cta:change')}
        </InlineLink>
      </FlexWrapper>

      <UpdateFormWrapper open={form.editSupplementForm} data-cy='supplement-update-form'>
        <SupplementUpdateForm
          supplement={props.supplement}
          id={props.id}
          closeAllForms={closeAllForms.bind(this)}
          setElement={props.setElement}
        />
      </UpdateFormWrapper>

      <FlexWrapper spaceBetween={2} data-cy='max-cats'>
        <Cat />
        <Text>
          {t('HostProfile:max-cats')} {props.maxCats}
        </Text>
        <InlineLink id='editMaxCatsForm' data-cy='change' onClick={(e) => formHandler(e)} text='sm' color='info'>
          {t('reusable:cta:change')}
        </InlineLink>
      </FlexWrapper>

      <UpdateFormWrapper open={form.editMaxCatsForm} data-cy='max-cats-update-form'>
        <MaxCatsUpdateForm
          maxCats={props.maxCats}
          id={props.id}
          closeAllForms={closeAllForms.bind(this)}
          setElement={props.setElement}
        />
      </UpdateFormWrapper>

      <FlexWrapper spaceBetween={2} data-cy='availability'>
        <Availabilty />
        <Text>{t('HostProfile:availability')}</Text>
        <InlineLink id='editableCalendar' data-cy='change' onClick={(e) => formHandler(e)} text='sm' color='info'>
          {t('reusable:cta:change')}
        </InlineLink>
      </FlexWrapper>
      {!form.editableCalendar && (
        <AvailabilityViewOnlyMode
          selectedDays={props.availability.map(function (date) {
            return new Date(date);
          })}
        />
      )}

      <UpdateFormWrapper open={form.editableCalendar} data-cy='availability-update-form'>
        <AvailabilityUpdateForm
          availability={props.availability}
          id={props.id}
          setElement={props.setElement}
          incomingBookings={props.incomingBookings}
          closeAllForms={closeAllForms.bind(this)}
        />
      </UpdateFormWrapper>

      <Divider top={5} bottom={5} />
      <Share link={`https://kattbnb.se/user/${props.loggedInUserId}`} title={t('HostProfile:share')} />

      <Responsive displayIn={['mobile']}>
        <Divider top={5} />
      </Responsive>
    </Whitebox>
  );
});

HostProfile.displayName = 'HostProfile';

const mapStateToProps = (state) => ({
  loggedInUserId: state.reduxTokenAuth.currentUser.attributes.id,
});

export default connect(mapStateToProps)(HostProfile);
