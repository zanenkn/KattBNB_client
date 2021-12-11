import React from 'react';
import { connect } from 'react-redux';
import ReviewScore from '../../ReusableComponents/ReviewScore';
import { pricePerDay, finalTotal } from '../../../Modules/PriceCalculations';
import RequestToBookCTA from '../../ReusableComponents/RequestToBookCTA';
import { useTranslation, Trans } from 'react-i18next';
import User from '../../Icons/User';
//import Location from './Icons/src/Location';
import Price from '../../Icons/Price';
import Review from '../../Icons/Review';
import Spinner from '../../ReusableComponents/Spinner';
import Popup from 'reactjs-popup';
import { useFetchHost } from './useFetchHost';

const HostPopup = ({ id, open, onClose, currentSearch }) => {
  const { t, ready } = useTranslation('HostPopup');
  const { host, loading } = useFetchHost(id);
  console.log('transformed response', host);

  if (loading) {
    return (
      <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
        <Spinner />
      </Popup>
    );
  }

  return (
    <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
      <p>host profile nr {id}</p>
      <p>the current search is from {currentSearch.start} to {currentSearch.end} in {currentSearch.location}</p>
    </Popup>
  );


  // if (ready) {
  //   let perDay = pricePerDay(props.rate, props.numberOfCats, props.supplement, props.checkInDate, props.checkOutDate);
  //   let orderTotal = finalTotal(
  //     props.rate,
  //     props.numberOfCats,
  //     props.supplement,
  //     props.checkInDate,
  //     props.checkOutDate
  //   );

  //   return (
  //     <>
  //       <Image
  //         src={
  //           props.avatar === null
  //             ? `https://ui-avatars.com/api/?name=${props.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
  //             : props.avatar
  //         }
  //         size='small'
  //         style={{ borderRadius: '50%', margin: 'auto', marginBottom: '0.5rem' }}
  //       ></Image>
  //       {props.score && <ReviewScore score={props.score} height={'1rem'} center={true} displayNumerical={true} />}
  //       <Header as='h2' style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
  //         <User fill={'#c90c61'} height={'0.8em'} />
  //         &ensp;{props.nickname}
  //       </Header>
  //       <Header as='h4' style={{ marginBottom: '0', marginTop: '0', lineHeight: '150%' }}>
  //         <span style={{ whiteSpace: 'nowrap' }}>
  //           <Location fill={'grey'} height={'0.8em'} />
  //           &nbsp;{props.location}&ensp;
  //         </span>
  //         <span style={{ whiteSpace: 'nowrap' }}>
  //           <Price fill={'grey'} height={'0.8em'} />
  //           &nbsp;{perDay} {t('reusable:price.per-day')}&ensp;
  //         </span>
  //         {props.reviewsCount && (
  //           <span style={{ whiteSpace: 'nowrap' }}>
  //             <Review fill={'grey'} height={'0.8em'} />
  //             &nbsp;{t('reusable:reviews', { count: parseInt(props.reviewsCount) })}
  //           </span>
  //         )}
  //       </Header>
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
});

export default connect(mapStateToProps)(HostPopup);