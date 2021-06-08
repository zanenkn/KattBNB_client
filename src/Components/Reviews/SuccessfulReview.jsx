import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../ReusableComponents/Spinner';
import { useTranslation } from 'react-i18next';

const SuccessfulReview = () => {
  const { t, ready } = useTranslation('SuccessfulReview');
  return <div>a</div>
  // if (ready) {
  //   return (
  //     <div className='content-wrapper'>
  //       <Header as='h1'>{t('SuccessfulReview:title')}</Header>
  //       <Segment className='whitebox' style={{ textAlign: 'center' }}>
  //         <p>{t('SuccessfulReview:text')}</p>
  //         <Link to='all-bookings' id='back-to-bookings' className='fake-link-underlined-reg'>
  //           {t('SuccessfulReview:bookings-cta')}
  //         </Link>
  //       </Segment>
  //     </div>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

export default SuccessfulReview;
