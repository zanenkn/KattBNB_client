import React, { useLayoutEffect } from 'react';
import ReviewScore from '../../common/ReviewScore';
import { pricePerDay, finalTotal } from '../../Modules/PriceCalculations';
import { useTranslation, Trans } from 'react-i18next';
import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';
// import User from '../icons/User';
// import Review from '../icons/src/Review';
//import AvailableHost from '../icons/AvailableHost';

const List = ({ finalAvailableHosts, checkInDate, checkOutDate, location, numberOfCats, handleListItemClick, onUnmount }) => {
  useLayoutEffect(() => {
    return () => {
      onUnmount()
    }
  }, [])


  const { t, ready } = useTranslation('List');
  return <div>this is a list</div>
  // if (ready) {
  //   return (
  //     <div style={{ padding: '2rem' }}>
  //       {finalAvailableHosts.length === 0 && (
  //         <Header>
  //           <Trans i18nKey='List:no-results'>
  //             Your search did not yield any results! Try
  //             <Link
  //               className='fake-link'
  //               style={{ textDecoration: 'underline' }}
  //               to={{
  //                 pathname: '/search',
  //                 state: {
  //                   checkInDate: new Date(checkInDate),
  //                   checkOutDate: new Date(checkOutDate),
  //                   location: location,
  //                   numberOfCats: numberOfCats,
  //                 },
  //               }}
  //             >
  //               changing your search criteria
  //             </Link>
  //             or go to the map view to find cat sitters in nearby areas.
  //           </Trans>
  //         </Header>
  //       )}
  //       {finalAvailableHosts.length > 0 &&
  //         finalAvailableHosts.map((host) => {
  //           let perDay = pricePerDay(
  //             host.price_per_day_1_cat,
  //             numberOfCats,
  //             host.supplement_price_per_cat_per_day,
  //             checkInDate,
  //             checkOutDate
  //           );
  //           let orderTotal = finalTotal(
  //             host.price_per_day_1_cat,
  //             numberOfCats,
  //             host.supplement_price_per_cat_per_day,
  //             checkInDate,
  //             checkOutDate
  //           );
  //           return (
  //             <div
  //               className='list-card'
  //               key={host.id}
  //               onClick={(e) => handleListItemClick(host.user.id, host.available)}
  //               id={host.user.id}
  //             >
  //               {host.available && (
  //                 <div className='available-host'>
  //                   <div style={{ margin: '10px' }}>
  //                     <AvailableHost height='30px' />
  //                   </div>
  //                 </div>
  //               )}
  //               {host.score && <ReviewScore score={host.score} height={'1rem'} displayNumerical={true} />}
  //               <div style={{ margin: '0', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
  //                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  //                   <Image
  //                     src={
  //                       host.user.profile_avatar === null
  //                         ? `https://ui-avatars.com/api/?name=${host.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
  //                         : host.user.profile_avatar
  //                     }
  //                     style={{ borderRadius: '50%', margin: 'auto', height: '100px' }}
  //                   />
  //                   <p style={{ fontSize: 'small', marginTop: '0.3rem' }}>
  //                     <User fill={'grey'} height={'0.8em'} />
  //                     &ensp;
  //                     <strong>{host.user.nickname}</strong>
  //                   </p>
  //                 </div>
  //                 <div style={{ padding: '0 0 0 2rem' }}>
  //                   <div>
  //                     <Header as='h3' style={{ textAlign: 'left', marginBottom: '0' }}>
  //                       {perDay} {t('reusable:price.per-day')}
  //                     </Header>
  //                     <Header as='h5' style={{ textAlign: 'left', margin: '0' }}>
  //                       {orderTotal} {t('reusable:price.total')}
  //                     </Header>
  //                     {host.score && (
  //                       <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
  //                         <Review fill={'grey'} height={'0.8em'} /> &ensp;
  //                         <p style={{ fontSize: 'small' }}>
  //                           <strong>{t('reusable:reviews', { count: host.reviews_count })}</strong>
  //                         </p>
  //                       </div>
  //                     )}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           );
  //         })}
  //     </div>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

export default List;
