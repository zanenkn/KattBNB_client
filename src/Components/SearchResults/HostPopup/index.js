import React from 'react';
import { connect } from 'react-redux';
import ReviewScore from '../../ReusableComponents/ReviewScore';
import { pricePerDay, finalTotal } from '../../../Modules/PriceCalculations';
import RequestToBookCTA from '../../ReusableComponents/RequestToBookCTA';
import { useTranslation, Trans } from 'react-i18next';
import { Location, User } from '../../Icons';
import Price from '../../Icons/Price';
import Review from '../../Icons/Review';
import Spinner from '../../ReusableComponents/Spinner';
import Popup from 'reactjs-popup';
import { useFetchHost } from './useFetchHost';
import { Avatar, Flexbox, Text } from '../../../UI-Components';

const HostPopup = ({ id, open, onClose, currentSearch, host }) => {
  const { t, ready } = useTranslation('HostPopup');
  const { loading } = useFetchHost(id);
  console.log('transformed response', host);

  const perDay = pricePerDay(host.rate, currentSearch.cats, host.supplement, currentSearch.start, currentSearch.end);
  const orderTotal = finalTotal(host.rate, currentSearch.cats, host.supplement, currentSearch.start, currentSearch.end);

  if (loading || !ready) {
    return (
      <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
        <Spinner />
      </Popup>
    );
  }

  return (
    <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
      <Avatar
        src={
          host.avatar === null
            ? `https://ui-avatars.com/api/?name=${host.name}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
            : host.avatar
        }
      />
      {host.score && <ReviewScore score={host.score} center={true} displayNumerical={true} />}

      <Flexbox>
        <User />
        <Text>{host.name}</Text>
      </Flexbox>
      <Flexbox>
        <Text>
          <span style={{ whiteSpace: 'nowrap' }}>
            <Location />
            &nbsp;{host.location}&ensp;
          </span>
          <span style={{ whiteSpace: 'nowrap' }}>
            <Price fill={'grey'} height={'0.8em'} />
            &nbsp;{perDay} {t('reusable:price.per-day')}&ensp;
          </span>
          {host.reviewsCount && (
            <span style={{ whiteSpace: 'nowrap' }}>
              <Review fill={'grey'} height={'0.8em'} />
              &nbsp;{t('reusable:reviews', { count: parseInt(host.reviewsCount) })}
            </span>
          )}
        </Text>
      </Flexbox>

      <p>{host.rate}</p>
      <p>
        the current search is from {currentSearch.start} to {currentSearch.end} in {currentSearch.location}
      </p>
    </Popup>
  );

  // if (ready) {

  //   return (
  //     <>
  //

  //       {props.allowToBook && (
  //         <Header
  //           onClick={props.handleHostProfileClick}
  //           className='fake-link-underlined'
  //           id='more'
  //           style={{
  //             marginTop: '0.5rem',
  //             marginBottom: '1.5rem',
  //             textAlign: 'center',
  //             marginLeft: 'auto',
  //             marginRight: 'auto',
  //             display: 'table',
  //           }}
  //         >
  //           {t('HostPopup:more')}
  //         </Header>
  //       )}
  //       {props.allowToBook ? (
  //         <RequestToBookCTA
  //           numberOfCats={props.numberOfCats}
  //           nickname={props.nickname}
  //           checkInDate={props.checkInDate}
  //           checkOutDate={props.checkOutDate}
  //           orderTotal={orderTotal}
  //           requestToBookButtonClick={props.requestToBookButtonClick.bind(this)}
  //         />
  //       ) : (
  //         <p className='small-centered-paragraph' style={{ marginTop: '1rem' }}>
  //           {t('HostPopup:own-profile-warning')}
  //         </p>
  //       )}
  //       {props.allowToBook && !props.hostAvailable && (
  //         <p className='small-centered-paragraph'>
  //           <Trans i18nKey='HostPopup:host-availability-disclaimer'>
  //             This cat sitter have not added information about their availability for the dates you chose. You can still
  //             send them a booking request or
  //             <span
  //               id='send-message'
  //               className='fake-link-underlined'
  //               style={{ display: 'contents' }}
  //               onClick={props.messageHost}
  //             >
  //               contact them
  //             </span>
  //             first to see if they are available.
  //           </Trans>
  //         </p>
  //       )}
  //     </>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

const mapStateToProps = (state) => ({
  currentUserId: state.reduxTokenAuth.currentUser.attributes.id,
  currentSearch: state.currentSearch,
  host: state.currentHostProfile,
});

export default connect(mapStateToProps)(HostPopup);
