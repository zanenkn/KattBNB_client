import { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Popup from 'reactjs-popup';

import { priceOfOneAmount } from '../../../Modules/PriceCalculations';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';

import { useHostProfile } from '../../../utils/useHostProfile';
import Spinner from '../../../common/Spinner';

import { Header, Text, ContentWrapper, Notice, Whitebox, Flexbox } from '../../../UI-Components';
import { Address, Availabilty, Cat, Rate } from '../../../icons';
import { CenteredTable } from './styles';

import HostInfo from '../../HostInfo';

const BookingDetails = ({ history, id, location: { state } }) => {
  const { t, ready } = useTranslation('BookingDetails');

  const {
    startDate,
    endDate,
    priceTotal,
    address,
    lat,
    long,
    numberOfCats,
    score,
  } = state;

  const total = priceOfOneAmount(priceTotal);
  const [errors, setErrors] = useState([]);

  const { host: fetchedHost, loading, errors: fetchErrors } = useHostProfile(state.hostProfileId);

  const host = {
    ...fetchedHost,
    ...{ lat: parseFloat(lat), long: parseFloat(long), address: address, score: score },
  };

  useEffect(() => {
    if (state === undefined || history.action === 'POP') {
      history.push({ pathname: '/' });
    }
    // eslint-disable-next-line
  }, []);

  const messageHost = () => {
    const { hostId } = state;
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (id === undefined) {
        history.push('/');
      } else {
        const lang = detectLanguage();
        const path = '/api/v1/conversations';
        const payload = {
          user1_id: id,
          user2_id: hostId,
          locale: lang,
        };
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        axios
          .post(path, payload, { headers: headers })
          .then(({ data }) => {
            history.push({
              pathname: `/conversation/${data.id}`,
            });
          })
          .catch(({ response }) => {
            if (response === undefined) {
              setErrors(['reusable:errors.unknown']);
            } else if (response.status === 500) {
              setErrors(['reusable:errors:500']);
            } else if (response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else if (response.status === 422) {
              setErrors(['reusable:errors:422-conversation']);
            } else {
              setErrors([response.data.error]);
            }
          });
      }
    }
  };

  if (!ready || loading ) return <Spinner />;

  return (
    <ContentWrapper>
      <Popup
        modal
        open={errors.length}
        closeOnDocumentClick={true}
        onClose={() => window.location.replace('/all-bookings')}
        position='top center'
      >
        <Notice nature='danger'>
          <ul id='message-error-list'>
            {[...errors, ...fetchErrors].map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      </Popup>

      <Header centered>{t('BookingDetails:booking-details')}</Header>
      <Whitebox>
        <CenteredTable>
          <Flexbox spaceItemsX={1} horizontalAlign='left'>
            <Availabilty />
            <Text>
              {startDate} {t('BookingDetails:until')}&nbsp;{endDate}
            </Text>
          </Flexbox>
          <Flexbox spaceItemsX={1} horizontalAlign='left'>
            <Address />
            <Text>{address}</Text>
          </Flexbox>
          <Flexbox spaceItemsX={2} horizontalAlign='left'>
            <Flexbox spaceItemsX={1} horizontalAlign='left'>
              <Rate />
              <Text>
                {total} {t('reusable:price:total')}
              </Text>
            </Flexbox>
            <Flexbox spaceItemsX={1} horizontalAlign='left'>
              <Cat />
              <Text>{numberOfCats}</Text>
            </Flexbox>
          </Flexbox>
        </CenteredTable>
      </Whitebox>
      <Header level={2} centered>
        {t('BookingDetails:about-host')}
      </Header>
      <HostInfo host={host} messageHost={() => messageHost()} />
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({ id: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(BookingDetails);
