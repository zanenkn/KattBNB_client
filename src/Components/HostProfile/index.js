import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import axios from 'axios';
import { connect } from 'react-redux';

import { wipeCredentials } from '../../Modules/wipeCredentials';

import Spinner from '../../common/Spinner';
import Responsive from '../../common/Responsive';
import Share from '../../common/Share';
import useCurrentScope from '../../hooks/useCurrentScope';

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

const HostProfile = ({
  hostProfileId,
  description,
  fullAddress,
  rate,
  maxCats,
  supplement,
  availability,
  location,
  incomingBookings,
  stripeState,
  setElement,
  form,
  toggleForm,
  loggedInUserId,
}) => {
  const { t, ready } = useTranslation('HostProfile');
  const { locale, headers } = useCurrentScope();

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const createStripeAccount = async () => {
    if (window.navigator.onLine === false) {
      setLoading(false);
      return setErrors(['reusable:errors:window-navigator']);
    }
    try {
      const path = `/api/v1/host_profiles/${hostProfileId}`;
      
      const payload = {
        code: queryString.parse(window.location.search).code,
        locale: locale,
      };
      const response = await axios.patch(path, payload, { headers: headers });
      setElement('stripeAccountId', response.data.id);
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
      queryString.parse(window.location.search).state === stripeState
    ) {
      createStripeAccount();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

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
        {description}
        <InlineLink
          id='editDescriptionForm'
          data-cy='change'
          onClick={(e) => toggleForm(e.target.id)}
          text='sm'
          color='info'
        >
          {t('reusable:cta:change')}
        </InlineLink>
      </DescriptionWrapper>

      <UpdateFormWrapper open={form.editDescriptionForm} data-cy='description-update-form'>
        <DescriptionUpdateForm
          description={description}
          id={hostProfileId}
          toggleForm={() => toggleForm('editDescriptionForm')}
          setElement={setElement}
        />
      </UpdateFormWrapper>

      <DescriptionWrapper data-cy='address'>
        <Address />
        {fullAddress}
        <InlineLink id='editAddress' data-cy='change' onClick={(e) => toggleForm(e.target.id)} text='sm' color='info'>
          {t('reusable:cta:change')}
        </InlineLink>
      </DescriptionWrapper>

      <UpdateFormWrapper open={form.editAddress} data-cy='address-update-form'>
        <AddressUpdateForm
          fullAddress={fullAddress}
          id={hostProfileId}
          toggleForm={() => toggleForm('editAddress')}
          location={location}
          setElement={setElement}
        />
      </UpdateFormWrapper>

      <FlexWrapper spaceBetween={2} data-cy='rate'>
        <Rate />
        <Text>
          {rate} {t('reusable:price:total-for-1')}
        </Text>
        <InlineLink id='editRateForm' data-cy='change' onClick={(e) => toggleForm(e.target.id)} text='sm' color='info'>
          {t('reusable:cta:change')}
        </InlineLink>
      </FlexWrapper>

      <UpdateFormWrapper open={form.editRateForm} data-cy='rate-update-form'>
        <RateUpdateForm
          rate={rate}
          id={hostProfileId}
          toggleForm={() => toggleForm('editRateForm')}
          setElement={setElement}
        />
      </UpdateFormWrapper>

      <FlexWrapper spaceBetween={2} data-cy='supplement'>
        <Supplement />
        <Text>
          {t('HostProfile:extra')} {supplement} {t('reusable:price:total-day')}
        </Text>
        <InlineLink
          id='editSupplementForm'
          data-cy='change'
          onClick={(e) => toggleForm(e.target.id)}
          text='sm'
          color='info'
        >
          {t('reusable:cta:change')}
        </InlineLink>
      </FlexWrapper>

      <UpdateFormWrapper open={form.editSupplementForm} data-cy='supplement-update-form'>
        <SupplementUpdateForm
          supplement={supplement}
          id={hostProfileId}
          toggleForm={() => toggleForm('editSupplementForm')}
          setElement={setElement}
        />
      </UpdateFormWrapper>

      <FlexWrapper spaceBetween={2} data-cy='max-cats'>
        <Cat />
        <Text>
          {t('HostProfile:max-cats')} {maxCats}
        </Text>
        <InlineLink
          id='editMaxCatsForm'
          data-cy='change'
          onClick={(e) => toggleForm(e.target.id)}
          text='sm'
          color='info'
        >
          {t('reusable:cta:change')}
        </InlineLink>
      </FlexWrapper>

      <UpdateFormWrapper open={form.editMaxCatsForm} data-cy='max-cats-update-form'>
        <MaxCatsUpdateForm
          maxCats={maxCats}
          id={hostProfileId}
          toggleForm={() => toggleForm('editMaxCatsForm')}
          setElement={setElement}
        />
      </UpdateFormWrapper>

      <FlexWrapper spaceBetween={2} data-cy='availability'>
        <Availabilty />
        <Text>{t('HostProfile:availability')}</Text>
        <InlineLink
          id='editableCalendar'
          data-cy='change'
          onClick={(e) => toggleForm(e.target.id)}
          text='sm'
          color='info'
        >
          {t('reusable:cta:change')}
        </InlineLink>
      </FlexWrapper>
      {!form.editableCalendar && (
        <AvailabilityViewOnlyMode
          selectedDays={availability.map(function (date) {
            return new Date(date);
          })}
        />
      )}

      <UpdateFormWrapper open={form.editableCalendar} data-cy='availability-update-form'>
        <AvailabilityUpdateForm
          availability={availability}
          id={hostProfileId}
          setElement={setElement}
          incomingBookings={incomingBookings}
          toggleForm={() => toggleForm('editableCalendar')}
        />
      </UpdateFormWrapper>

      <Divider top={5} bottom={5} />
      <Share link={`https://kattbnb.se/user/${loggedInUserId}`} title={t('HostProfile:share')} />

      <Responsive displayIn={['mobile']}>
        <Divider top={5} />
      </Responsive>
    </Whitebox>
  );
};

HostProfile.displayName = 'HostProfile';

const mapStateToProps = (state) => ({
  loggedInUserId: state.reduxTokenAuth.currentUser.attributes.id,
});

export default connect(mapStateToProps)(HostProfile);
