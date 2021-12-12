import React from 'react';
import { connect } from 'react-redux';
import ReviewScore from '../../ReusableComponents/ReviewScore';
import { pricePerDay, finalTotal } from '../../../Modules/PriceCalculations';
import RequestToBookCTA from '../../ReusableComponents/RequestToBookCTA';
import { useTranslation, Trans } from 'react-i18next';
import { Location, User, CreditCard, Review } from '../../Icons';
import Spinner from '../../ReusableComponents/Spinner';
import Popup from 'reactjs-popup';
import { useFetchHost } from './useFetchHost';
import { Avatar, Flexbox, Text, Header, Container, InlineLink } from '../../../UI-Components';

const HostPopup = ({ id, open, onClose, currentSearch, host, loggedInUserId, toHostProfile }) => {
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
      <Flexbox direction='column'>
        <Avatar
          space={4}
          src={
            !host.avatar
              ? `https://ui-avatars.com/api/?name=${host.name}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
              : host.avatar
          }
        />
        {host.score && (
          <Container>
            <ReviewScore score={host.score} center={true} displayNumerical={true} height={4} margin={0} />
          </Container>
        )}

        <Flexbox spaceItemsX={1} space={2}>
          <User />
          <Header level={4}>{host.name}</Header>
        </Flexbox>
        <Flexbox spaceItemsX={2}>
          <Flexbox spaceItemsX={1}>
            <Location />
            <Text>{host.location}</Text>
          </Flexbox>
          <Flexbox spaceItemsX={1}>
            <CreditCard />
            <Text>
              {perDay} {t('reusable:price.per-day')}
            </Text>
          </Flexbox>
        </Flexbox>
        {host.reviewsCount && (
          <Flexbox spaceItemsX={1}>
            <Review />
            <Text>{t('reusable:reviews', { count: parseInt(host.reviewsCount) })}</Text>
          </Flexbox>
        )}
        {loggedInUserId !== host.userId && (
          <InlineLink color={'primary'} onClick={() => toHostProfile()}>
            {t('HostPopup:more')}
          </InlineLink>
        )}
      </Flexbox>
    </Popup>
  );

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
  loggedInUserId: state.reduxTokenAuth.currentUser.attributes.id,
  currentSearch: state.currentSearch,
  host: state.currentHostProfile,
});

export default connect(mapStateToProps)(HostPopup);
