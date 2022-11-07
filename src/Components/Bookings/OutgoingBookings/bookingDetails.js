import { useEffect } from 'react';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Popup from 'reactjs-popup';

import { priceOfOneAmount } from '../../../Modules/PriceCalculations';
import { useStartConversation } from '../../../utils/useStartConversation';

import { useHostProfile } from '../../../utils/useHostProfile';
import Spinner from '../../../common/Spinner';

import { Header, Text, ContentWrapper, Notice, Whitebox, Flexbox } from '../../../UI-Components';
import { Address, Availabilty, Cat, Rate } from '../../../icons';
import { CenteredTable } from './styles';

import HostInfo from '../../HostInfo';

const BookingDetails = ({ history, id, location: { state } }) => {
  const { t, ready } = useTranslation('BookingDetails');

  const { startDate, endDate, priceTotal, address, lat, long, numberOfCats, score, hostId } = state;

  const total = priceOfOneAmount(priceTotal);

  const { host: fetchedHost, loading, errors: fetchErrors } = useHostProfile(state.hostProfileId);
  const { startConversation, errors: messengerErrors } = useStartConversation();

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

  if (!ready || loading) return <Spinner page />;

  return (
    <ContentWrapper>
      <Popup
        modal
        open={[...messengerErrors, ...fetchErrors].length}
        closeOnDocumentClick={true}
        onClose={() => window.location.replace('/all-bookings')}
        position='top center'
      >
        <Notice nature='danger'>
          <ul id='message-error-list'>
            {[...messengerErrors, ...fetchErrors].map((error) => (
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
      <HostInfo host={host} messageHost={() => startConversation({ userId1: id, userId2: hostId })} />
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({ id: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(BookingDetails);
